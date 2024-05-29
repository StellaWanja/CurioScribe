import express, { Express } from "express";
import cors from "cors";
import authRoutes from "../userManagement/controllers/auth.controller.js";

const app: Express = express();

const corsOptions = {
  origin: "http://localhost:5173", // for vite application
  optionsSuccessStatus: 200,
};

//middleware
app.use(cors(corsOptions));
app.use(express.json());

//routes
app.use("/auth", authRoutes);

export default app;