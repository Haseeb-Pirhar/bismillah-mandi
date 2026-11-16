import { Router } from "express";

import { MODE, PROJECT_NAME } from "@/constants/env";
import { authRoutes } from "@/modules/auth/routes";
import { settingRoutes } from "@/modules/setting/routes";
// import { storeProfileRoutes } from "@/modules/store";
// import { storeStatsRoutes } from "@/modules/store";
import { userRoutes } from "@/modules/user/routes";

import { cartRoutes } from "./cart-routes";
import { categoryRoutes } from "./category-routes";
// import { dashboardRoutes } from "./dashboard-routes";
import { orderRoutes } from "./order-routes";
import { productRoutes } from "./product-routes";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: `Welcome to the ${PROJECT_NAME} API ${MODE} mode` });
});

router.use("/api/auth", authRoutes);
router.use("/api/users", userRoutes);

// router.use("/api/store-profile", storeProfileRoutes);
// router.use("/api/store-stats", storeStatsRoutes);
// router.use("/api/dashboard", dashboardRoutes);
router.use("/api/category", categoryRoutes);
router.use("/api/setting", settingRoutes);
router.use("/api/order", orderRoutes);
router.use("/api/products", productRoutes);
router.use("/api/cart", cartRoutes);

// router.use("/api/profile", profileRoutes);

export { router as routes };
