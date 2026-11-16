import { Router } from "express";

import {
  addProduct,
  deleteProduct,
  updateProduct,
  getProducts,
} from "@/controllers/product-controller";
import { adminMiddleware, uploadMiddleware } from "@/middlewares";

const router = Router();
router.use(adminMiddleware);

const optionalUploadHelper = uploadMiddleware({
  destinationPath: "uploads/profiles",
  fields: [
    { name: "image", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ],
  isOptional: true,
});

router.post("/", optionalUploadHelper, addProduct);
router.put("/:id", optionalUploadHelper, updateProduct);
router.delete("/:id", deleteProduct);
router.get("/", getProducts);

export { router as productRoutes };
