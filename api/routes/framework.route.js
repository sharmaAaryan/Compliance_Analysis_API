import express from "express";
import protect, {isAdmin} from "../middleware/auth.middleware.js";
import {
  createFrameWork,
  getFramework,
} from "../controllers/framework.controller.js";

const router = express.Router();

router.post("/create", protect, isAdmin, createFrameWork);
router.get("/get", getFramework);

export default router;