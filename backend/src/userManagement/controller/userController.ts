import { Router } from "express";
import { forgotPassword } from "../services/authServices/forgotPassword.service.js";
import { signup } from "../services/authServices/signup.service.js";

const routes = Router();

routes.post('/signup', signup);
routes.post('/forgot-password', forgotPassword);

export default routes;