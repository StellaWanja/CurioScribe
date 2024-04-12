import { Router } from "express";
import { forgotPassword, login, signup, userProfile } from "../services/userService.js";
import { verifyToken } from "../utils/verifyToken.js";

const routes = Router();

routes.post('/signup', signup);
routes.post('/login', login);
routes.get('/user-profile', verifyToken, userProfile);
routes.post('/forgot-password', forgotPassword);

export default routes;