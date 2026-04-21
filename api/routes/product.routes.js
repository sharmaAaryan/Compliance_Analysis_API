import express from "express";
import { upload } from "../middleware/multer.js";
import { creatproduct } from "../controllers/product.controller.js";
import protect from "../middleware/auth.middleware.js"

const router= express.Router();

router.post ("/create",protect,upload.array("images",5),creatproduct);

export default router;