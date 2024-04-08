import { Router } from "express";
import { signup } from "../services/userService.js";

const routes = Router();

// signup route
routes.post('/signup', signup);

export default routes;