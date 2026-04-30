import express from "express";
import dotenv from "dotenv";
import authrouter from "./api/routes/auth.routes.js";
import organizationrouter from "./api/routes/organization.routes.js";
import cookieParser from "cookie-parser";
import frameworkrouter from "./api/routes/framework.route.js";
import productRouter from "./api/routes/product.routes.js";
import protect from "./api/middleware/auth.middleware.js";
import cors from "cors";

dotenv.config();
const app = express();

//  middlewares:
//cors...
app.use (
    cors({
        origin:"http://localhost:5173",
        methods:["GET","POST","PUT","PATCH","DELETE"],
        credentials:true,
}),
);
app.use(express.json());
app.use(cookieParser());


//  routes:
app.use("/api/auth", authrouter);
app.use("/api/organization", organizationrouter);
app.use("/api/framework", frameworkrouter);
app.use("/api/product",productRouter);
//  http://localhost:5000/api/auth/signup
export default app;
