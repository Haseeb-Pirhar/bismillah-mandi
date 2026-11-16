import { Request, Response } from "express";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import jwt from "jsonwebtoken";

import { statusCodes } from "@/constants";
import { IUser, User } from "@/modules/user/model";
import { catchAsync } from "@/utils/catch-async";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const APPLE_CLIENT_ID = process.env.APPLE_CLIENT_ID as string;

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

import { generateToken } from "../utils";

export const googleLogin = catchAsync(async (req: Request, res: Response): Promise<Response> => {
  const { idToken, device, platform } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: idToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload() as TokenPayload | null;

    if (!payload) {
      return res.status(statusCodes.UNAUTHORIZED).json({ message: "Invalid Google token." });
    }

    if (!payload.email_verified) {
      return res.status(statusCodes.UNAUTHORIZED).json({ message: "Email is not verified." });
    }

    const { email, name, picture } = payload;

    let userResult = await User.findOne({ email });

    if (!userResult) {
      const newUser = new User({
        email,
        username: name,
        image: picture,
        password: "social", // No password for social login
        type: "social",
        device,
        platform,
      });

      userResult = await newUser.save();
    } else {
      if (device) userResult.device = device;
      if (platform) userResult.platform = platform;
      await userResult.save();
    }

    const jwtToken = generateToken(userResult);

    const sanitizedUser = sanitizeUser(userResult);

    return res.status(statusCodes.OK).json({
      message: "'Login successful. Welcome to App. 😀🎊 !",
      data: { ...sanitizedUser, token: jwtToken },
    });
  } catch (error: Error | any) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message || "Error during Google login.", error });
  }
});

export const appleLogin = catchAsync(async (req: Request, res: Response): Promise<Response> => {
  const { identityToken, device, platform, fullName } = req.body;

  if (!identityToken) {
    return res.status(statusCodes.BAD_REQUEST).json({ message: "Identity token is required." });
  }

  try {
    const decodedToken = jwt.decode(identityToken, { complete: true });

    if (!decodedToken) {
      return res.status(statusCodes.UNAUTHORIZED).json({ message: "Invalid identity token." });
    }

    const payload = decodedToken.payload as {
      sub: string;
      email?: string;
      email_verified?: string;
      aud: string;
    };

    if (payload.aud !== APPLE_CLIENT_ID) {
      return res.status(statusCodes.UNAUTHORIZED).json({ message: "Invalid audience in token." });
    }

    if (!payload.email_verified) {
      return res.status(statusCodes.UNAUTHORIZED).json({ message: "Email is not verified." });
    }

    let user = await User.findOne({ email: payload.email });

    if (!user) {
      user = new User({
        email: payload.email,
        fullName,
        password: "social", // No password for social login
        type: "social",
        device,
        platform,
      });
      await user.save();
    } else {
      if (device) user.device = device;
      if (platform) user.platform = platform;
      await user.save();
    }

    const sanitizedUser = sanitizeUser(user);

    const jwtToken = generateToken(user);

    return res.status(statusCodes.OK).json({
      message: "'Login successful. Welcome to App. 😀🎊 !",
      data: { ...sanitizedUser, token: jwtToken },
    });
  } catch (error: Error | any) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message || "Error during Apple signup.", error });
  }
});

const sanitizeUser = (user: IUser) => {
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.__v;
  return userObj;
};
