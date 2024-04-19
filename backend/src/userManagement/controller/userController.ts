import { Router } from "express";
import { signup } from "../services/authServices/signup.js";
import { login } from "../services/authServices/login.js";
import { forgotPassword } from "../services/authServices/forgotPassword.js";
import { resetPassword } from "../services/authServices/resetPassword.js";
import { userProfile } from "../services/profileServices/getUserProfile.js";
import { verifyToken } from "../utils/tokens/verifyToken.js";

const routes = Router();

routes.post('/signup', signup);
routes.post('/login', login);
routes.get('/user-profile', verifyToken, userProfile);
routes.post('/forgot-password', forgotPassword);
routes.post('/reset-password', resetPassword);

export default routes;