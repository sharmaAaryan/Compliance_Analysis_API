import express from "express";
import {
  createOrganization,
  getAllCompanies,
} from "../controllers/organization.controller.js";
import  protect  from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/create", protect, createOrganization);
router.get("/get-companies", getAllCompanies);

export default router;