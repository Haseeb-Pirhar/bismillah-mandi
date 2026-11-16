// import { Router } from "express";

// import { authMiddleware } from "@/middlewares/auth-middleware";
// import { uploadMiddleware } from "@/middlewares/upload-middleware";
// import {
//   getProfile,
//   updateProfile,
//   deleteProfile,
//   changeProfilePassword,
//   getMyAds,
//   getPublicProfile,
//   getStoreProfile,
//   updateLanguage,
//   changeProfileEmail,
//   changeProfilePhone,
//   updateUserCurrency,
//   emailOtpVerify,
//   blockUser,
// } from "@/modules/user/controllers";
// import { catchAsync } from "@/utils/catch-async";

// const optionalUploadHelper = uploadMiddleware({
//   destinationPath: "uploads/profiles",
//   fields: [
//     { name: "image", maxCount: 1 },
//     { name: "coverImage", maxCount: 1 },
//   ],
//   isOptional: true,
// });

// const router = Router();

// router.get("/market/:storeId", getStoreProfile);
// router.get("/my-ads", authMiddleware, catchAsync(getMyAds));
// router.get("/:userId", getPublicProfile);

// router.use(authMiddleware);

// router.get("/", catchAsync(getProfile));

// router.post("/change-email", catchAsync(changeProfileEmail));
// router.post("/email-otp-verify", catchAsync(emailOtpVerify));
// router.post("/block/:userId", blockUser);

// router.put("/", optionalUploadHelper, catchAsync(updateProfile));
// router.put("/language", optionalUploadHelper, catchAsync(updateLanguage));
// router.put("/currency", catchAsync(updateUserCurrency));
// router.put("/change-password", catchAsync(changeProfilePassword));
// router.put("/change-phone", catchAsync(changeProfilePhone));

// router.delete("/", catchAsync(deleteProfile));

// export { router as profileRoutes };
