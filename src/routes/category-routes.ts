import { Router } from "express";

import * as categoryController from "@/controllers";

const router = Router();

router.get("/", categoryController.getCategory);
router.post("/", categoryController.createCategory);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

export { router as categoryRoutes };
