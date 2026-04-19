import express from "express";
import {
  createOrganization,
  getAllCompanies,
} from "../controllers/organization.controller.js";
import { protect } from "../middleware/auth.middeware.js";

const router = express.Router();
router.post("/create", protect, createOrganization);
router.post("/get-companies", getAllCompanies);

export default router;