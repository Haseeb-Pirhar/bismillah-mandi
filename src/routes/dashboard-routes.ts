// import express from "express";

// import {
//   getDashboardStats,
//   getUserReports,
//   getPropertyReports,
//   getVehicleReports,
//   getMarketReports,
//   getReviews,
//   reviewStatusUpdate,
//   reportStatusUpdate,
//   getLatestEntitiesStats,
//   getTotalVehicles,
//   getTotalProperty,
//   getTotalMarket,
//   storeStatusUpdate,
//   getStoreByAdmin,
//   cancelOrderByAdmin,
//   // refundOrderByAdmin,
//   getAllOrderByAdmin,
//   updateCartEnable,
//   getUsersByLocation,
//   getErrorLogs,
// } from "@/controllers/dashboard-controller";
// import { deleteMarketPlace } from "@/controllers/market-controller";
// import { adminMiddleware } from "@/middlewares";

// const router = express.Router();

// router.use(adminMiddleware);

// router.get("/stats", getDashboardStats);
// router.get("/latest-entities-stats", getLatestEntitiesStats);
// router.get("/user-reports", getUserReports);
// router.get("/property-reports", getPropertyReports);
// router.get("/vehicle-reports", getVehicleReports);
// router.get("/market-reports", getMarketReports);
// router.get("/reviews", getReviews);
// router.get("/total-vehicles", getTotalVehicles);
// router.get("/total-properties", getTotalProperty);
// router.get("/total-markets", getTotalMarket);
// router.get("/total-stores", getStoreByAdmin);
// router.get("/order", getAllOrderByAdmin);
// router.get("/user-location", getUsersByLocation);
// router.get("/error-logs", getErrorLogs);

// router.put("/reviews/:id", reviewStatusUpdate);
// router.put("/report/:id", reportStatusUpdate);
// router.put("/store/:id", storeStatusUpdate);
// router.put("/update-cart/:id", updateCartEnable);

// router.delete("/order/:id", cancelOrderByAdmin);
// router.delete("/:id", deleteMarketPlace);

// export { router as dashboardRoutes };
