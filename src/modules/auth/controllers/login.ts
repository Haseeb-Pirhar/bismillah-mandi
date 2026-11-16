import { Request, Response } from "express";

import { statusCodes } from "@/constants";
import { IUser, User } from "@/modules/user/model";
import { catchAsync } from "@/utils/catch-async";

import { comparePasswords, generateToken } from "../utils";
interface LoginRequest {
  email: string;
  password: string;
  device?: string;
  platform: string;
}

export const login = catchAsync(
  async (req: Request<object, object, LoginRequest>, res: Response): Promise<Response> => {
    try {
      const { email, password, device, platform } = req.body;

      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const isValidPhone = /^\+?[1-9]\d{1,14}$/.test(email);
      let phone: string | undefined;
      if (!isValidEmail && isValidPhone) {
        phone = email.startsWith("+") ? email : `+${email}`;
      }

      let user: IUser | null = null;

      if (isValidEmail) {
        user = await User.findOne({ email }).select("+password");
      } else if (phone) {
        user = await User.findOne({ phone }).select("+password");
      }

      if (!user || !user.password || user.type === "temp") {
        return res.status(statusCodes.NOT_FOUND).json({ message: "Invalid credentials" });
      }

      const isMatch = await comparePasswords(password, user.password);
      if (!isMatch) {
        return res.status(statusCodes.NOT_FOUND).json({ message: "Invalid credentials" });
      }

      if (device && platform) {
        user.device = device;
        user.platform = platform;
        await user.save();
      }

      const token = generateToken(user);
      const userObj = sanitizeUser(user);

      return res.status(statusCodes.OK).json({
        message: "'Login successful. Welcome to the App. 😀🎊 !",
        data: { ...userObj, token },
      });
    } catch (error: Error | any) {
      return res
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message || "Error logging in", error });
    }
  },
);

const sanitizeUser = (user: IUser) => {
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.__v;
  return userObj;
};
