// import { Request, Response } from "express";
// import mongoose from "mongoose";

// import { statusCodes } from "@/constants/statusCodes";
// import { Follow, IUser } from "@/modules/user/model";
// import { userService } from "@/modules/user/services";
// import { catchAsync } from "@/utils/catch-async";

// export const getAllUsers = catchAsync(async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const userId = (req.user as IUser)._id as mongoose.Types.ObjectId;
//     const users = await userService.getAllUsers(userId);
//     return res.status(statusCodes.OK).json({ data: users });
//   } catch (error: Error | any) {
//     return res
//       .status(statusCodes.INTERNAL_SERVER_ERROR)
//       .json({ message: error.message || "Error fetching users", error });
//   }
// });

// export const getUserInfo = catchAsync(async (req: Request, res: Response): Promise<Response> => {
//   try {
//     const userId = req.params.id;
//     const user = await userService.getUserById(userId);
//     if (!user) {
//       return res.status(statusCodes.NOT_FOUND).json({ message: "User not found" });
//     }
//     const followers = await Follow.find({ following: userId }).countDocuments();
//     const following = await Follow.find({ follower: userId }).countDocuments();

//     const counts = {
//       followers,
//       following,
//     };

//     return res.status(statusCodes.OK).json({ user, counts });
//   } catch (error: Error | any) {
//     return res
//       .status(statusCodes.INTERNAL_SERVER_ERROR)
//       .json({ message: error.message || "Server error", error });
//   }
// });
