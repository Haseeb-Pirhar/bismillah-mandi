// import { Request, Response } from "express";

// import { sendNotification } from "@/config/oneSignal";
// import { statusCodes } from "@/constants";
// import { Order } from "@/models/order-model";
// import { IStore, Store } from "@/modules/store";
// import { IUser, User } from "@/modules/user/model";
// import { catchAsync } from "@/utils/catch-async";
// import { getLatestStats } from "@/utils/getStats";

// export const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
//   try {
//     const [reports, reviewsData] = await Promise.all([
//       Report.find()
//         .populate("reporter", "_id username fullName email image")
//         .populate("reportedItem")
//         .sort("-createdAt"),
//       Review.find().populate("reviewer", "_id username fullName email image").sort("-createdAt"),
//     ]);

//     const getlatest = (type: string) => reports.filter((r) => r.type === type).slice(0, 3);
//     const counts = (type: string) => reports.filter((r) => r.type === type).length;

//     return res.status(statusCodes.OK).json({
//       message: "Dashboard reports fetched successfully",
//       data: {
//         users: getlatest("User"),
//         property: getlatest("Property"),
//         vehicle: getlatest("Vehicle"),
//         market: getlatest("Market"),
//         reviews: reviewsData.slice(0, 3),
//         counts: {
//           users: counts("User"),
//           property: counts("Property"),
//           vehicle: counts("Vehicle"),
//           market: counts("Market"),
//           reviews: reviewsData.length,
//         },
//       },
//     });
//   } catch (error: Error | any) {
//     return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
//       message: error.message || "Error fetching dashboard reports",
//       error,
//     });
//   }
// });

// export const getUserReports = catchAsync(async (req: Request, res: Response) => {
//   try {
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const status = req.query.status;

//     const filter: any = { type: "User", ...(status && { status }) };
//     if (status === "ALL" || !status) {
//       delete filter.status;
//     } else {
//       filter.status = status;
//     }

//     const [reports, total] = await Promise.all([
//       Report.find(filter)
//         .populate("reporter", "_id username fullName email image")
//         .populate("reportedItem")
//         .sort("-createdAt")
//         .skip((page - 1) * limit)
//         .limit(limit),
//       Report.countDocuments(filter),
//     ]);

//     return res.status(statusCodes.OK).json({
//       message: "User reports fetched successfully",
//       data: reports,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error: Error | any) {
//     return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
//       message: error.message || "Error fetching user reports",
//       error,
//     });
//   }
// });

// export const getPropertyReports = catchAsync(async (req: Request, res: Response) => {
//   try {
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const status = req.query.status;

//     const filter: any = { type: "User", ...(status && { status }) };
//     if (status === "ALL" || !status) {
//       delete filter.status;
//     } else {
//       filter.status = status;
//     }
//     const [reports, total] = await Promise.all([
//       Report.find({ type: "Property" })
//         .populate("reporter", "_id username fullName email image")
//         .populate({
//           path: "reportedItem",
//           populate: {
//             path: "owner",
//             select: "_id username email image fullName type",
//           },
//         })
//         .sort("-createdAt")
//         .skip((page - 1) * limit)
//         .limit(limit),
//       Report.countDocuments({ type: "Property" }),
//     ]);

//     return res.status(statusCodes.OK).json({
//       message: "Property reports fetched successfully",
//       data: reports,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error: Error | any) {
//     return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
//       message: error.message || "Error fetching event reports",
//       error,
//     });
//   }
// });

// export const getVehicleReports = catchAsync(async (req: Request, res: Response) => {
//   try {
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const status = req.query.status;

//     const filter: any = { type: "User", ...(status && { status }) };
//     if (status === "ALL" || !status) {
//       delete filter.status;
//     } else {
//       filter.status = status;
//     }
//     const [reports, total] = await Promise.all([
//       Report.find({ type: "Vehicle" })
//         .populate("reporter", "_id username fullName email image")
//         .populate({
//           path: "reportedItem",
//           populate: {
//             path: "owner",
//             select: "_id username email image fullName type",
//           },
//         })
//         .sort("-createdAt")
//         .skip((page - 1) * limit)
//         .limit(limit),
//       Report.countDocuments({ type: "Vehicle" }),
//     ]);

//     return res.status(statusCodes.OK).json({
//       message: "Vehicle reports fetched successfully",
//       data: reports,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error: Error | any) {
//     return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
//       message: error.message || "Error fetching post reports",
//       error,
//     });
//   }
// });

// export const getMarketReports = catchAsync(async (req: Request, res: Response) => {
//   try {
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const status = req.query.status;

//     const filter: any = { type: "User", ...(status && { status }) };
//     if (status === "ALL" || !status) {
//       delete filter.status;
//     } else {
//       filter.status = status;
//     }
//     const [reports, total] = await Promise.all([
//       Report.find({ type: "Market" })
//         .populate("reporter", "_id username fullName email image")
//         .populate({
//           path: "reportedItem",
//           populate: {
//             path: "owner",
//             select: "_id username email image fullName type",
//           },
//         })
//         .sort("-createdAt")
//         .skip((page - 1) * limit)
//         .limit(limit),
//       Report.countDocuments({ type: "Market" }),
//     ]);

//     return res.status(statusCodes.OK).json({
//       message: "Market reports fetched successfully",
//       data: reports,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error: Error | any) {
//     return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
//       message: error.message || "Error fetching comment reports",
//       error,
//     });
//   }
// });

// export const getReviews = catchAsync(async (req: Request, res: Response) => {
//   try {
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;

//     const [reviews, total] = await Promise.all([
//       Review.find()
//         .populate("reviewer", "_id username fullName email image")
//         .sort("-createdAt")
//         .skip((page - 1) * limit)
//         .limit(limit),
//       Review.countDocuments(),
//     ]);

//     return res.status(statusCodes.OK).json({
//       message: "Reviews fetched successfully",
//       data: reviews,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error: Error | any) {
//     return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
//       message: error.message || "Error fetching reviews",
//       error,
//     });
//   }
// });

// export const reportStatusUpdate = catchAsync(async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const user = req.user as IUser;
//     const { status } = req.body;

//     const report = await Report.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true, runValidators: true },
//     ).populate("reporter");
//     if (!report) {
//       return res.status(statusCodes.NOT_FOUND).json({
//         message: "Report not found",
//       });
//     }

//     const message = `Your report status has been updated to ${status}`;
//     const reporter = report.reporter as any;
//     if (reporter.device) {
//       sendNotification({
//         message,
//         title: "Report Status Update",
//         playerIds: [reporter.device],
//       });
//     }
//     await createNotification(
//       {
//         content: message,
//         owner: reporter._id,
//         sender: user._id as string,
//         type: "report",
//       },
//       res,
//     );

//     return res.status(statusCodes.OK).json({
//       message: "Report status updated successfully",
//       data: report,
//     });
//   } catch (error: Error | any) {
//     return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
//       message: error.message || "Error updating report status",
//       error,
//     });
//   }
// });

// export const reviewStatusUpdate = catchAsync(async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const user = req.user as IUser;
//     const { status } = req.body;

//     const review = await Review.findByIdAndUpdate(
//       id,
//       { status },
//       { new: true, runValidators: true },
//     ).populate("reviewer");

//     if (!review) {
//       return res.status(statusCodes.NOT_FOUND).json({
//         message: "Review not found",
//       });
//     }
//     const reviewer = review.reviewer as any;
//     const message = `Your review status has been updated to ${status}`;
//     if (reviewer.device) {
//       sendNotification({
//         message,
//         title: "Report Status Update",
//         playerIds: [reviewer.device],
//       });
//     }
//     await createNotification(
//       {
//         content: message,
//         owner: reviewer._id,
//         sender: user._id as string,
//         type: "review",
//       },
//       res,
//     );

//     return res.status(statusCodes.OK).json({
//       message: "Review status updated successfully",
//       data: review,
//     });
//   } catch (error: Error | any) {
//     return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
//       message: error.message || "Error updating review status",
//       error,
//     });
//   }
// });

// export const getLatestEntitiesStats = catchAsync(async (req: Request, res: Response) => {
//   try {
//     const models: Record<string, any> = {
//       user: User,
//       property: Property,
//       vehicle: Vehicle,
//       market: Market,
//       report: Report,
//       review: Review,
//       store: Store,
//     };
//     const entity = (req.query.entity as string)?.toLowerCase();
//     const period = req.query.period as any;
//     const users = await User.countDocuments({
//       type: { $nin: ["temp", "admin", "superAdmin", "business"] },
//     });
//     const storeUsers = await Store.countDocuments({ type: "business" });
//     const properties = await Property.countDocuments();
//     const vehicles = await Vehicle.countDocuments();
//     const markets = await Market.countDocuments();
//     const reports = await Report.countDocuments();
//     const reviews = await Review.countDocuments();

//     const results: Record<string, any> = {};
//     if (entity && models[entity]) {
//       if (entity === "user") {
//         results[entity] = await getLatestStats(User, period, {
//           type: { $nin: ["temp", "admin", "superAdmin", "business"] },
//         });
//       } else if (entity === "store") {
//         results[entity] = await getLatestStats(Store, period, { type: "business" });
//       } else {
//         results[entity] = await getLatestStats(models[entity], period);
//       }
//     } else {
//       for (const [name, model] of Object.entries(models)) {
//         if (name === "user") {
//           results[name] = await getLatestStats(User, period, {
//             type: { $nin: ["temp", "admin", "superAdmin", "business"] },
//           });
//         } else if (name === "store") {
//           results[name] = await getLatestStats(Store, period, { type: "business" });
//         } else {
//           results[name] = await getLatestStats(model, period);
//         }
//       }
//     }

//     return res.status(statusCodes.OK).json({
//       message: "Entities fetched successfully",
//       data: results,
//       counts: {
//         users,
//         properties,
//         vehicles,
//         markets,
//         reports,
//         reviews,
//         storeUsers,
//       },
//     });
//   } catch (error: Error | any) {
//     return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
//       message: error.message || "Error fetching entities stats",
//       error,
//     });
//   }
// });

// export const getTotalVehicles = catchAsync(async (req: Request, res: Response) => {
//   try {
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const total = await Vehicle.countDocuments();

//     const vehicles = await Vehicle.find()
//       .populate("owner")
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .sort("-createdAt");

//     return res.status(statusCodes.OK).json({
//       message: "Total vehicles fetched successfully",
//       data: vehicles,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error: Error | any) {
//     return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
//       message: error.message || "Error fetching total vehicles",
//       error,
//     });
//   }
// });

// export const getTotalProperty = catchAsync(async (req: Request, res: Response) => {
//   try {
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const total = await Property.countDocuments();

//     const totalProperties = await Property.find()
//       .populate("owner")
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .sort("-createdAt");

//     return res.status(statusCodes.OK).json({
//       message: "Total properties fetched successfully",
//       data: totalProperties,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error: Error | any) {
//     return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
//       message: error.message || "Error fetching total properties",
//       error,
//     });
//   }
// });

// export const getTotalMarket = catchAsync(async (req: Request, res: Response) => {
//   try {
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const total = await Market.countDocuments();

//     const totalMarkets = await Market.find()
//       .populate("owner")
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .sort("-createdAt");

//     return res.status(statusCodes.OK).json({
//       message: "Total markets fetched successfully",
//       data: totalMarkets,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error: Error | any) {
//     return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
//       message: error.message || "Error fetching total markets",
//       error,
//     });
//   }
// });

// export const storeStatusUpdate = catchAsync(async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { isVerified } = req.body;

//     const store = await Store.findByIdAndUpdate(id, { isVerified }, { new: true });
//     if (!store) {
//       return res.status(statusCodes.NOT_FOUND).json({
//         message: "Store not found",
//       });
//     }
//     await store.save();
//     return res.status(statusCodes.OK).json({
//       message: "Store status updated successfully",
//       data: Store,
//     });
//   } catch (error: Error | any) {
//     return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
//       message: error.message || "Error updating report status",
//       error,
//     });
//   }
// });

// export const getStoreByAdmin = catchAsync(async (req: Request, res: Response) => {
//   try {
//     const stores = await Store.find({
//       type: { $in: ["business"] },
//     }).sort({ isVerified: 1 });

//     return res.status(statusCodes.OK).json({
//       message: "Stores fetched successfully",
//       data: stores,
//     });
//   } catch (error: Error | any) {
//     return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
//       message: error.message || "Error fetching stores",
//       error,
//     });
//   }
// });

// export const getAllOrderByAdmin = catchAsync(async (req: Request, res: Response) => {
//   try {
//     const orders = await Order.find().populate("userId", "name email").populate("products");

//     return res.status(statusCodes.OK).json({
//       message: "Orders fetched successfully",
//       orders,
//     });
//   } catch (error: Error | any) {
//     return res.status(statusCodes.BAD_REQUEST).json({
//       message: error.message || "Failed to fetch orders",
//       error,
//     });
//   }
// });

// export const cancelOrderByAdmin = catchAsync(async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const order = await Order.findById(id);

//     if (!order) {
//       return res.status(statusCodes.NOT_FOUND).json({ message: "Order not found" });
//     }

//     if (["shipped", "delivered", "completed"].includes(order.status)) {
//       return res.status(statusCodes.BAD_REQUEST).json({
//         message: "Cannot cancel order after it is shipped or delivered",
//       });
//     }

//     order.status = "cancelled";
//     await order.save();

//     return res.status(statusCodes.OK).json({
//       message: "Order cancelled successfully",
//       order,
//     });
//   } catch (error: Error | any) {
//     return res.status(statusCodes.BAD_REQUEST).json({
//       message: error.message || "Failed to cancel order",
//       error,
//     });
//   }
// });

// // export const refundOrderByAdmin = catchAsync(async (req: Request, res: Response) => {
// //   try {
// //     const { id } = req.params;
// //     const order = await Order.findById(id).populate("userId", "name email").populate("products");

// //     if (!order) {
// //       return res.status(statusCodes.NOT_FOUND).json({ message: "Order not found" });
// //     }
// //     if (order.status !== "cancelled") {
// //       return res.status(statusCodes.BAD_REQUEST).json({
// //         message: "Only cancelled orders can be refunded",
// //       });
// //     }
// //     order.paymentStatus = "refunded";
// //     await order.save();
// //     return res.status(statusCodes.OK).json({
// //       message: "Order refunded successfully",
// //       order,
// //     });
// //   } catch (error: Error | any) {
// //     return res.status(statusCodes.BAD_REQUEST).json({
// //       message: error.message || "Failed to refund order",
// //       error,
// //     });
// //   }
// // });

// export const updateCartEnable = catchAsync(async (req: Request, res: Response) => {
//   try {
//     const admin = req.user as IUser;
//     const { id } = req.params;
//     if (!admin) {
//       return res.status(statusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
//     }
//     const owner = (await Store.findById(id)) as IStore;
//     if (!owner) {
//       return res.status(statusCodes.NOT_FOUND).json({ message: "Store not found" });
//     }
//     const updatedOwner = await Store.findByIdAndUpdate(
//       owner._id,
//       { $set: { cartEnabled: !owner.cartEnabled } },
//       { new: true },
//     );
//     return res.status(statusCodes.ACCEPTED).json({
//       message: `Cart status changed to ${updatedOwner?.cartEnabled} successfully`,
//       data: updatedOwner,
//     });
//   } catch (error: Error | any) {
//     return res
//       .status(statusCodes.INTERNAL_SERVER_ERROR)
//       .json({ message: error.message || "Failed to update cartEnabled", error });
//   }
// });

// export const getUsersByLocation = catchAsync(async (req: Request, res: Response) => {
//   try {
//     const { location, city, country } = req.body;
//     const filter: any = {
//       type: "normal",
//     };

//     if (location?.longitude && location?.latitude) {
//       filter.location = {
//         $geoIntersects: {
//           $geometry: {
//             type: "Point",
//             coordinates: [location.longitude, location.latitude],
//           },
//         },
//       };
//     } else if (city || country) {
//       if (city) filter.city = { $regex: new RegExp(`^${city}$`, "i") };
//       if (country) filter.country = { $regex: new RegExp(`^${country}$`, "i") };
//     }

//     const users = await User.find(filter).sort({ createdAt: -1 });
//     return res.status(statusCodes.OK).json({
//       message: "Users fetched successfully",
//       data: { users, count: users.length },
//     });
//   } catch (error: any) {
//     return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
//       message: error.message,
//       error,
//     });
//   }
// });

// export const getErrorLogs = catchAsync(async (req: Request, res: Response) => {
//   try {
//     const page = parseInt(req.query.page as string) || 1;
//     const limit = parseInt(req.query.limit as string) || 10;
//     const source = req.query.source as string;

//     const filter: any = {};
//     if (source) {
//       filter.source = source;
//     }

//     const [logs, total] = await Promise.all([
//       Log.find(filter)
//         .sort("-createdAt")
//         .skip((page - 1) * limit)
//         .limit(limit),
//       Log.countDocuments(filter),
//     ]);

//     return res.status(statusCodes.OK).json({
//       message: "Error logs fetched successfully",
//       data: logs,
//       pagination: {
//         page,
//         limit,
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error: Error | any) {
//     return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
//       message: error.message || "Error fetching error logs",
//       error,
//     });
//   }
// });
