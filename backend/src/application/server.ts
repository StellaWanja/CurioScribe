import dotenv from "dotenv";
import express, { Express } from "express";
import userRoutes from "../userManagement/controller/userController.js";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

//middleware for parsing body
app.use(express.json());

//routes
app.use("/user", userRoutes);

//listen
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
