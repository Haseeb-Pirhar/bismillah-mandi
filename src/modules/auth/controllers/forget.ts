import { Request, Response } from "express";

import { sendEmail } from "@/config";
import { statusCodes } from "@/constants/statusCodes";
import { User } from "@/modules/user/model";
import { userService } from "@/modules/user/services";
import { otpService } from "@/services";
import { otpEmailTemplate } from "@/templates";
import { catchAsync } from "@/utils/catch-async";

import { hashPassword, generateToken } from "../utils";

export const forgotPasswordLink = catchAsync(
  async (req: Request, res: Response): Promise<Response> => {
    const { email, callback } = req.body;

    try {
      const user = await userService.findUserByEmail(email);
      if (!user) {
        return res.status(statusCodes.NOT_FOUND).json({ message: "User not found" });
      }

      const token = generateToken(user);

      const resetLink = `${callback}?token=${token}`;

      const mailInfo = {
        to: email,
        subject: "Password Reset",
        html: `<p>Click here to reset your password: </p> <a href=${resetLink} > ${resetLink} </a>`,
      };

      // Send email with the reset link
      await sendEmail(mailInfo);
      return res.status(statusCodes.OK).json({
        message: "Password reset link sent to your email that will expire in 1 hour",
      });
    } catch (error: Error | any) {
      return res
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message || "Error sending password reset link", error });
    }
  },
);

export const forgotPasswordOtp = catchAsync(
  async (req: Request, res: Response): Promise<Response> => {
    const { email } = req.body;

    if (!email) {
      return res.status(statusCodes.BAD_REQUEST).json({ message: "Email is required" });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(statusCodes.NOT_FOUND).json({ message: "User not found" });
      }

      const { otp, otpExpires } = otpService.generateOtp();
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();

      const mailInfo = {
        to: email,
        subject: "Password Reset OTP",
        html: otpEmailTemplate({
          otp,
          recipientName: email.split("@")[0],
          headline: "Verify your Yallah Nashoof account",
          subheading:
            "Enter the code below in the app to unlock your personalized onboarding checklist.",
        }),
      };
      await sendEmail(mailInfo);

      return res.status(statusCodes.OK).json({ message: "OTP sent to your email" });
    } catch (error: Error | any) {
      return res
        .status(statusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message || "Error sending OTP", error });
    }
  },
);

export const validateOtp = catchAsync(async (req: Request, res: Response): Promise<Response> => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(statusCodes.BAD_REQUEST).json({ message: "Email and OTP are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({ message: "User not found" });
    }

    if (user.otp !== otp || !user.otpExpires || user.otpExpires.getTime() < Date.now()) {
      return res.status(statusCodes.NOT_FOUND).json({ message: "Invalid or expired OTP" });
    }

    return res.status(statusCodes.OK).json({ message: "OTP is valid" });
  } catch (error: Error | any) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message || "Internal server error", error });
  }
});

export const resetPassword = catchAsync(async (req: Request, res: Response): Promise<Response> => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res
      .status(statusCodes.BAD_REQUEST)
      .json({ message: "Email, OTP, and new password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(statusCodes.NOT_FOUND).json({ message: "User not found" });
    }

    if (user.otp !== otp || !user.otpExpires || user.otpExpires.getTime() < Date.now()) {
      return res.status(statusCodes.NOT_FOUND).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(statusCodes.OK).json({ message: "Password reset successfully" });
  } catch (error: Error | any) {
    return res
      .status(statusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message || "Error resetting password", error });
  }
});
