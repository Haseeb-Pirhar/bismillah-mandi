import { Router } from "express";

import * as orderController from "@/controllers";

const router = Router();

router.post("/", orderController.createOrder);

export { router as orderRoutes };
