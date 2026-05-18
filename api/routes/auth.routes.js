import express from "express";
import { signup, signin, me, logout } from "../controllers/auth.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup",signup);
router.post("/signin",signin);
router.get("/me", protect, me);
router.post("/logout", protect, logout);

export default router;