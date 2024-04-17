import jwt from "jsonwebtoken";
import {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_MESSAGES,
  HTTP_STATUS_UNAUTHORIZED_ACCESS,
} from "./httpConstants.js";

// Middleware to verify the Bearer token and get the user's ID
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization; // Get the Bearer token from the Authorization header

    if (!token || !token.startsWith("Bearer ")) {
      return res
        .status(HTTP_STATUS_UNAUTHORIZED_ACCESS)
        .send(HTTP_STATUS_MESSAGES[HTTP_STATUS_UNAUTHORIZED_ACCESS]);
    }

    const tokenValue = token.replace("Bearer ", "");
    const decoded = await jwt.verify(tokenValue, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send(HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR]);
  }
};
