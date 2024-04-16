import { Router } from "express";
import { signup, login, forgotPassword, resetPassword } from "../services/authService.js";
import { userProfile } from "../services/profileService.js";
import { verifyToken } from "../utils/verifyToken.js";

const routes = Router();

routes.post('/signup', signup);
routes.post('/login', login);
routes.get('/user-profile', verifyToken, userProfile);
routes.post('/forgot-password', forgotPassword);
routes.post('/reset-password', resetPassword);

export default routes;