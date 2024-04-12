import jwt from "jsonwebtoken";
import { httpConstants } from "./httpConstants.js";

// Middleware to verify the Bearer token and get the user's ID
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization; // Get the Bearer token from the Authorization header

    if (!token || !token.startsWith("Bearer ")) {
      return res.send(httpConstants[401].unauthorizedAccess);
    }

    const tokenValue = token.replace("Bearer ", "");
    const decoded = await jwt.verify(tokenValue, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.send(httpConstants[401].unauthorizedAccess);
  }
};
