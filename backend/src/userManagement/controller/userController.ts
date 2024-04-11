import { Router } from "express";
import { login, signup, userProfile } from "../services/userService.js";

const routes = Router();

routes.post('/signup', signup);
routes.post('/login', login);
routes.post('/user-profile', userProfile);

export default routes;