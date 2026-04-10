import express from "express";
import { createOrganization } from "../controllers/organization.controller.js";
import { protect } from "../middleware/auth.middeware.js";

const router = express.Router();

router.post("/create", protect, createOrganization);

// http://localhost:5000/api/organization/create

export default router;
