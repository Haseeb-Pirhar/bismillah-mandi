// import { Request, Response } from "express";
// import mongoose from "mongoose";

// import { sendEmail } from "@/config";
// import { statusCodes } from "@/constants/statusCodes";
// import { comparePasswords, hashPassword } from "@/modules/auth/utils";
// import { Block, Follow, IUser, User } from "@/modules/user/model";
// import { userService } from "@/modules/user/services";
// import { otpService } from "@/services";
// import { otpEmailTemplate } from "@/templates";
// import { catchAsync, fileHelper } from "@/utils";

// export const updateProfile = async (req: Request, res: Response) => {
//   try {
//     const user = req.user as IUser;
//     const { password, email, username, phone } = req.body;
//     if (password || email || username || phone) {
//       delete req.body.email;
//       delete req.body.password;
//       delete req.body.username;
//       delete req.body.phone;
//       delete req.body.currency;
//     }

//     let previousImage: string | undefined;
//     let previousCover: string | undefined;
//     if (req.body.image !== user.image) previousImage = user.image;
//     if (req.body.coverImage !== user.coverImage) previousCover = user.coverImage;

//     const updatedUser = await User.findByIdAndUpdate(user._id, req.body, { new: true });

//     if (previousImage) await fileHelper.deleteFile(previousImage);
//     if (previousCover) await fileHelper.deleteFile(previousCover);

//     return res
//       .status(statusCodes.ACCEPTED)
//       .json({ message: "Profile Updated Successfully", data: updatedUser });
//   } catch (error: Error | any) {
//     return res
//       .status(statusCodes.INTERNAL_SERVER_ERROR)
//       .json({ message: error.message || "Server error", error });
//   }
// };

// export const updateLanguage = async (req: Request, res: Response) => {
//   try {
//     const user = req.user as IUser;
//     const { language } = req.body;

//     const updatedUser = await User.findByIdAndUpdate(user._id, { language }, { new: true });

//     return res
//       .status(statusCodes.ACCEPTED)
//       .json({ message: "Language Updated Successfully", data: updatedUser });
//   } catch (error: Error | any) {
//     return res
//       .status(statusCodes.INTERNAL_SERVER_ERROR)
//       .json({ message: error.message || "Server error", error });
//   }
// };

// export const deleteProfile = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const userId = (req.user as IUser)._id as mongoose.Types.ObjectId;
//     const user = await userService.deleteUser(userId.toString());
//     if (!user) {
//       return res.status(statusCodes.NOT_FOUND).json({ message: "User not found" });
//     }
//     return res.status(statusCodes.OK).json({ message: "User deleted successfully" });
//   } catch (error: Error | any) {
//     return res
//       .status(statusCodes.INTERNAL_SERVER_ERROR)
//       .json({ message: error.message || "Error deleting user", error });
//   }
// };

// export const changeProfilePassword = async (req: Request, res: Response) => {
//   try {
//     const { oldPassword, newPassword } = req.body;
//     const userId = (req.user as IUser)._id;
//     const user = await User.findById(userId);
//     if (!user || !user.password) {
//       return res.status(statusCodes.NOT_FOUND).json({ message: "User not found" });
//     }

//     if (user.type !== "social") {
//       const isMatch = await comparePasswords(oldPassword, user.password);
//       if (!isMatch) {
//         return res.status(statusCodes.BAD_REQUEST).json({ message: "Incorrect old password" });
//       }
//     }

//     const hashedPassword = await hashPassword(newPassword);
//     user.password = hashedPassword;
//     if (user.type === "social") user.type = "normal";
//     await user.save();

//     return res.status(statusCodes.OK).json({ message: "Password changed successfully" });
//   } catch (error: Error | any) {
//     return res
//       .status(statusCodes.INTERNAL_SERVER_ERROR)
//       .json({ message: error.message || "Server error", error });
//   }
// };

// export const changeProfileEmail = async (req: Request, res: Response) => {
//   try {
//     const user = req.user as IUser;
//     const { newEmail, password } = req.body;
//     const userInfo = await User.findById(user._id).select("+password");
//     if (!userInfo) {
//       return res.status(statusCodes.NOT_FOUND).json({ message: "User not found" });
//     }

//     if (!password || !userInfo.password) {
//       return res.status(statusCodes.BAD_REQUEST).json({ message: "Password is required" });
//     }

//     const isMatch = await comparePasswords(password, userInfo.password);
//     if (!isMatch) {
//       return res.status(statusCodes.BAD_REQUEST).json({ message: "Incorrect password" });
//     }

//     const existingUser = await User.findOne({
//       email: newEmail,
//       type: { $ne: "temp" },
//     });

//     if (existingUser) {
//       return res
//         .status(statusCodes.BAD_REQUEST)
//         .json({ success: false, message: "Email already in use" });
//     }

//     const { otpExpires, otp } = otpService.generateOtp();

//     const mailInfo = {
//       to: newEmail,
//       subject: "Please use this OTP to verify your email",
//       html: otpEmailTemplate({
//         otp,
//         recipientName: userInfo.username,
//         headline: "Verify your new Email Address",
//         subheading: "Enter the code below in the app to verify your new email address.",
//       }),
//     };
//     await sendEmail(mailInfo);

//     user.otp = otp;
//     user.otpExpires = otpExpires;
//     await user.save();

//     return res.status(statusCodes.OK).json({ success: true, message: "OTP sent successfully" });
//   } catch (error: Error | any) {
//     return res
//       .status(statusCodes.INTERNAL_SERVER_ERROR)
//       .json({ success: false, message: error.message || "Server error", error });
//   }
// };

// export const emailOtpVerify = async (req: Request, res: Response): Promise<Response> => {
//   const user = req.user as IUser;
//   const { newEmail, otp } = req.body;

//   if (!newEmail || !otp) {
//     return res.status(statusCodes.BAD_REQUEST).json({ message: "Email and OTP are required" });
//   }

//   try {
//     const userInfo = await User.findOne({ email: user?.email });

//     if (!userInfo) {
//       return res.status(statusCodes.NOT_FOUND).json({ message: "User not found" });
//     }
//     if (user.otp !== otp || !user.otpExpires || user.otpExpires.getTime() < Date.now()) {
//       return res.status(statusCodes.NOT_FOUND).json({ message: "Invalid or expired OTP" });
//     }

//     userInfo.email = newEmail;
//     userInfo.otp = undefined;
//     userInfo.otpExpires = undefined;
//     await userInfo.save();

//     return res
//       .status(statusCodes.OK)
//       .json({ success: true, message: "Email updated successfully" });
//   } catch (error: Error | any) {
//     return res
//       .status(statusCodes.INTERNAL_SERVER_ERROR)
//       .json({ success: false, message: error.message || "Server error", error });
//   }
// };

// export const changeProfilePhone = async (req: Request, res: Response) => {
//   try {
//     const { phone, password } = req.body;
//     const userId = (req.user as IUser)._id;
//     const user = await User.findById(userId).select("+password");

//     if (!user) {
//       return res.status(statusCodes.NOT_FOUND).json({ message: "User not found" });
//     }

//     if (!password || !user.password) {
//       return res.status(statusCodes.BAD_REQUEST).json({ message: "Password is required" });
//     }

//     const isMatch = await comparePasswords(password, user.password);
//     if (!isMatch) {
//       return res.status(statusCodes.BAD_REQUEST).json({ message: "Incorrect password" });
//     }

//     const existingUser = await User.findOne({
//       phone,
//       type: { $ne: "temp" },
//     });
//     if (existingUser) {
//       return res
//         .status(statusCodes.BAD_REQUEST)
//         .json({ success: false, message: "Phone already in use" });
//     }

//     user.phone = phone;
//     await user.save();

//     return res
//       .status(statusCodes.OK)
//       .json({ success: true, message: "Phone changed successfully" });
//   } catch (error: Error | any) {
//     return res
//       .status(statusCodes.INTERNAL_SERVER_ERROR)
//       .json({ success: false, message: error.message || "Server error", error });
//   }
// };

// export const getProfile = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const userId = (req.user as IUser)._id as mongoose.Types.ObjectId;
//     const user = await userService.getUserById(userId.toString());

//     const followers = await Follow.countDocuments({ following: userId });
//     const following = await Follow.countDocuments({ follower: userId, type: "User" });
//     const followingPets = await Follow.countDocuments({ follower: userId, type: "Pet" });
//     const blocked = await Block.countDocuments({ blocker: userId });

//     const userData = {
//       ...user,
//       followers,
//       following,
//       followingPets,
//       blocked,
//     };

//     return res.status(statusCodes.ACCEPTED).json(userData);
//   } catch (error: Error | any) {
//     return res
//       .status(statusCodes.INTERNAL_SERVER_ERROR)
//       .json({ message: error.message || "Something Went Wrong!", error });
//   }
// };

// export const getMyAds = async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const userId = (req.user as IUser)._id as mongoose.Types.ObjectId;
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const status = (req.query.status as string) || "Active";

//     const property = await Property.find({ owner: userId, status }).populate("owner");
//     const vehicle = await Vehicle.find({ owner: userId, status }).populate("owner");
//     const market = await Market.find({ owner: userId, status }).populate("owner");

//     const ads = [...property, ...vehicle, ...market].sort(
//       (a, b) => (b.createdAt?.getTime?.() ?? 0) - (a.createdAt?.getTime?.() ?? 0),
//     );

//     const total = ads.length;
//     const start = (page - 1) * limit;
//     const end = start + limit;
//     const paginatedAds = ads.slice(start, end);

//     return res.status(statusCodes.OK).json({
//       data: paginatedAds,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error: Error | any) {
//     return res
//       .status(statusCodes.INTERNAL_SERVER_ERROR)
//       .json({ message: error.message || "Error fetching ads", error });
//   }
// };

// export const getPublicProfile = catchAsync(async (req: Request, res: Response) => {
//   try {
//     const { userId } = req.params;
//     if (!userId) {
//       return res.status(statusCodes.BAD_REQUEST).json({ message: "User is required" });
//     }
//     const user = await User.findById(userId).select("-password -otp -otpExpires");
//     if (!user) {
//       return res.status(statusCodes.NOT_FOUND).json({ message: "User not found" });
//     }
//     const vehicles = await Vehicle.find({ owner: userId }).populate("owner");

//     const properties = await Property.find({ owner: userId }).populate("owner");
//     const markets = await Market.find({ owner: userId }).populate("owner");
//     return res.status(statusCodes.OK).json({
//       message: "Public profile fetched successfully",
//       data: { user, vehicles, properties, markets },
//     });
//   } catch (error: any) {
//     return res.status(statusCodes.BAD_REQUEST).json({
//       message: error.message || "Failed to fetch profile",
//       error,
//     });
//   }
// });

// export const getStoreProfile = catchAsync(async (req: Request, res: Response) => {
//   try {
//     const { storeId } = req.params;

//     if (!storeId) {
//       return res.status(statusCodes.BAD_REQUEST).json({ message: "StoreId is required" });
//     }

//     const store = await Store.findById(storeId);
//     if (!store) {
//       return res.status(statusCodes.NOT_FOUND).json({ message: "Store not found" });
//     }
//     const products = await Market.find({ owner: storeId }).populate("owner");

//     return res.status(statusCodes.OK).json({
//       message: "Store and products fetched successfully",
//       store,
//       products,
//     });
//   } catch (error: any) {
//     return res.status(statusCodes.BAD_REQUEST).json({
//       message: error.message || "Failed to fetch store and products",
//       error,
//     });
//   }
// });

// export const updateUserCurrency = async (req: Request, res: Response) => {
//   try {
//     const userId = (req.user as IUser)._id;
//     const { currency } = req.body;
//     const user = await User.findByIdAndUpdate(userId, { currency }, { new: true });

//     const markets = await Market.updateMany({ owner: userId }, { currency });
//     const vehicles = await Vehicle.updateMany({ owner: userId }, { currency });
//     const properties = await Property.updateMany({ owner: userId }, { currency });
//     if (!markets || !user || !vehicles || !properties) {
//       return res.status(statusCodes.NOT_FOUND).json({ message: "No post found for the user" });
//     }

//     return res
//       .status(statusCodes.ACCEPTED)
//       .json({ message: "Currency Updated Successfully", data: user });
//   } catch (error: Error | any) {
//     return res
//       .status(statusCodes.INTERNAL_SERVER_ERROR)
//       .json({ message: error.message || "Server error", error });
//   }
// };
