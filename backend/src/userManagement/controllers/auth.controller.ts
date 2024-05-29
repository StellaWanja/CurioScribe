import { Router } from "express";
import { signup } from "../services/authServices/signup.service.js";

const routes = Router();

routes.post('/signup', signup);

export default routes;