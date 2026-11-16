import { Router } from "express";

import {
  createAdmin,
  getSettings,
  updateSettings,
  getAllUser,
  sendTestNotification,
} from "./setting-controller";

const router = Router();

// Settings routes

router.get("/user", getAllUser);
router.put("/create-admin/:id", createAdmin);
router.get("/", getSettings);

router.post("/", updateSettings);
router.put("/update", sendTestNotification);

export { router as settingRoutes };
