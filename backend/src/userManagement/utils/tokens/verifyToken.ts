import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_MESSAGES, HTTP_STATUS_UNAUTHORIZED_ACCESS } from "../httpResponses.js";

dotenv.config();
const jwtSecret = process.env.JWT_SECRET as string;

// Middleware to verify the Bearer token and get the user's ID
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization; // Get the Bearer token from the Authorization header

    if (!token || !token.startsWith("Bearer ")) {
      return res
        .status(HTTP_STATUS_UNAUTHORIZED_ACCESS)
        .send(HTTP_STATUS_MESSAGES[HTTP_STATUS_UNAUTHORIZED_ACCESS]);
    }

    const tokenValue = token.replace("Bearer ", "");
    const decoded = await jwt.verify(tokenValue, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return {
      status: HTTP_STATUS_INTERNAL_SERVER_ERROR,
      message: HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR],
    };
  }
};
