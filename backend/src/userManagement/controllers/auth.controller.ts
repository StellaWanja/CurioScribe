import { Router } from "express";
import Signup from "../services/authServices/signup.service.js";
import Login from "../services/authServices/login.service.js";
import ForgotPassword from '../services/authServices/forgotPassword.service.js';
import ResetPassword from "../services/authServices/resetPassword.service.js";

const routes = Router();

routes.post('/signup', Signup);
routes.post('/login', Login);
routes.post('/forgot-password', ForgotPassword);
routes.post('/reset-password', ResetPassword);

export default routes;