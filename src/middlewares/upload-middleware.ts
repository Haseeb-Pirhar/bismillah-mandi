import fs from "fs";
import path from "path";

import { Request, Response, NextFunction } from "express";
import ffmpegPath from "ffmpeg-static";
import ffprobePath from "ffprobe-static";
import ffmpeg from "fluent-ffmpeg";
import multer from "multer";
import sharp from "sharp";

import { uploadFileToAws } from "@/config";
import { AWS, SERVER_URL, statusCodes } from "@/constants";

interface UploadOptions {
  destinationPath: string;
  propertyName?: string;
  fields?: { name: string; maxCount?: number; isMultipleField?: boolean }[];
  allowedMimeTypes?: string[];
  maxFileSize?: number;
  isMultiple?: boolean;
  isOptional?: boolean;
}

const createStorage = (destinationPath: string) =>
  multer.diskStorage({
    destination: (_req, _file, cb) => {
      if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true });
      }
      cb(null, destinationPath);
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(file.originalname);
      cb(null, `${uniqueSuffix}${ext}`);
    },
  });

const processFile = async (file: Express.Multer.File): Promise<string> => {
  let fileUrl: string;
  if (AWS.ACCESSKEYID) {
    const normalizedPath = file.path.replace(/\\/g, "/");
    const keyName = normalizedPath.endsWith(file.filename)
      ? normalizedPath
      : `${normalizedPath}/${file.filename}`;
    fileUrl = await uploadFileToAws(keyName, file.path, file.mimetype);
  } else {
    fileUrl = `${SERVER_URL}/${file.path}`;
  }
  fs.promises
    .unlink(file.path)
    .catch(() => console.warn("⚠️ Failed to delete temp file:", file.path));
  return fileUrl;
};

const extractThumbnail = async (videoPath: string, destinationPath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const { name } = path.parse(videoPath);
    const thumbnailName = `${name}-thumbnail.png`;
    const thumbnailPath = path.join(destinationPath, thumbnailName);
    ffmpeg.setFfmpegPath(ffmpegPath as string);
    ffmpeg.setFfprobePath(ffprobePath.path);
    ffmpeg(videoPath)
      .on("end", () => resolve(thumbnailPath))
      .on("error", (err) => reject(err))
      .screenshots({ count: 1, folder: destinationPath, filename: thumbnailName });
  });
};

export const uploadMiddleware = (options: UploadOptions) => {
  const {
    destinationPath,
    propertyName,
    fields,
    allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
      "image/avif",
      "video/mp4",
      "video/quicktime",
      "video/h265",
      "video/hevc",
    ],
    maxFileSize = 50 * 1024 * 1024,
    isMultiple = false,
    isOptional = false,
  } = options;

  const storage = createStorage(destinationPath);

  const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (allowedMimeTypes && !allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error(`Invalid file type. Allowed: ${allowedMimeTypes.join(", ")}`));
    }
    cb(null, true);
  };

  const multerUpload = multer({
    storage,
    fileFilter,
    limits: { fileSize: maxFileSize },
  });

  const processUploadedFile = async (file: Express.Multer.File) => {
    if (file.mimetype.startsWith("image/")) {
      return await handleCompressedImage(file, destinationPath);
    }

    if (file.mimetype.startsWith("video/")) {
      const thumbnailPath = await extractThumbnail(file.path, destinationPath);
      const stat = await fs.promises.stat(thumbnailPath);
      await processFile({
        ...file,
        path: thumbnailPath,
        mimetype: "image/png",
        originalname: path.basename(thumbnailPath),
        filename: path.basename(thumbnailPath),
        size: stat.size,
        fieldname: "thumbnail",
        destination: destinationPath,
        buffer: Buffer.from([]),
        stream: fs.createReadStream(thumbnailPath),
      } as Express.Multer.File);
      return await processFile(file);
    }

    return await processFile(file);
  };

  return async (req: Request, res: Response, next: NextFunction) => {
    let upload;
    if (fields) upload = multerUpload.fields(fields);
    else if (isMultiple) upload = multerUpload.array(propertyName!, 10);
    else upload = multerUpload.single(propertyName!);

    upload(req as any, res as any, async (err) => {
      try {
        if (err) throw err;
        if (!req.body) req.body = {};

        // ---------- Case 1: fields ----------
        if (fields) {
          for (const field of fields) {
            const files = (req.files as Record<string, Express.Multer.File[]>)[field.name];

            if (files?.length) {
              if (field.isMultipleField || (field.maxCount && field.maxCount > 1)) {
                req.body[field.name] = await Promise.all(
                  files.map(async (file) => processUploadedFile(file)),
                );
              } else {
                req.body[field.name] = await processUploadedFile(files[0]);
              }
            }
          }
        }

        // ---------- Case 2: multiple ----------
        else if (isMultiple) {
          const files = req.files as Express.Multer.File[];
          if (!files?.length && !isOptional)
            throw new Error(`No files uploaded for "${propertyName}"`);

          if (files?.length) {
            req.body[propertyName!] = await Promise.all(
              files.map(async (file) => processUploadedFile(file)),
            );
          }
        }

        // ---------- Case 3: single ----------
        else if (req.file) {
          req.body[propertyName!] = await processUploadedFile(req.file);
        } else if (!isOptional) {
          throw new Error(`No file uploaded for "${propertyName}"`);
        }

        next();
      } catch (error: any) {
        if (!isOptional) {
          return res.status(statusCodes.BAD_REQUEST).json({
            message: error.message || "Upload failed",
            error: error.stack?.toString().split(/\r\n|\n/),
          });
        }
        next();
      }
    });
  };
};

const handleCompressedImage = async (file: Express.Multer.File, destinationPath: string) => {
  const { name, ext } = path.parse(file.path);
  const compressedPath = path.join(destinationPath, `${name}-256${ext}`);

  const sharpPipeline = sharp(file.path).resize(256, 256, { fit: "cover" });

  if (file.mimetype === "image/png") {
    await sharpPipeline.png({ quality: 80, compressionLevel: 8 }).toFile(compressedPath);
  } else {
    await sharpPipeline.jpeg({ quality: 80 }).toFile(compressedPath);
  }

  await uploadFileToAws(
    compressedPath.replace(/\\/g, "/"),
    compressedPath,
    file.mimetype.startsWith("image/png") ? "image/png" : "image/jpeg",
  );

  const originalUrl = await uploadFileToAws(
    file.path.replace(/\\/g, "/"),
    file.path,
    file.mimetype,
  );

  fs.promises
    .unlink(compressedPath)
    .catch(() => console.warn("⚠️ Failed to delete temp compressed file:", compressedPath));

  fs.promises
    .unlink(file.path)
    .catch(() => console.warn("⚠️ Failed to delete temp original file:", file.path));

  return originalUrl;
};
