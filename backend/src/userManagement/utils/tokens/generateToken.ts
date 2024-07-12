import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_MESSAGES,
} from "../httpResponses.js";

dotenv.config();
const jwtSecret = process.env.JWT_SECRET as string;
const jwtExpires = "1h";

export const generateToken = async (userId: string, email: string) => {
  try {
    const token = jwt.sign({ userId: userId, email: email }, jwtSecret, {
      expiresIn: jwtExpires,
    });

    return token;
  } catch (error) {
    return {
      status: HTTP_STATUS_INTERNAL_SERVER_ERROR,
      message: HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR],
    };
  }
};
