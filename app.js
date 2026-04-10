import express from "express";
import dotenv from "dotenv";
import authrouter from "./api/routes/auth.routes.js";
import organizationrouter from "./api/routes/organization.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

//  middlewares:
app.use(express.json());
app.use(cookieParser());
//  routes:
app.use("/api/auth", authrouter);

app.use("/api/organization", organizationrouter);

//  http://localhost:5000/api/auth/signup
export default app;
