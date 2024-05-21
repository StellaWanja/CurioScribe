import express, { Express } from "express";
import cors from "cors";
import userRoutes from "../userManagement/controller/userController.js";

export default function (database: any) {
  const app: Express = express();

  const corsOptions = {
    origin: "http://localhost:5173", // for vite application
    optionsSuccessStatus: 200,
  };

  //middleware
  app.use(cors(corsOptions));
  app.use(express.json());

  //routes
  app.use("/user", userRoutes);

  //export default app;
  return app;
}
