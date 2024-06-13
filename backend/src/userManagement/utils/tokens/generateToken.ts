import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../../models/userModel.js";
import {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_MESSAGES,
} from "../httpResponses.js";

dotenv.config();
const jwtSecret = process.env.JWT_SECRET as string;

export const generateToken = async (
  userInfo: User[] | { status: number; message: string }
) => {
  try {
    const user = userInfo as User[];
    const { id, email } = user[0];

    const token = jwt.sign({ userId: id, email: email }, jwtSecret, {
      expiresIn: "1h",
    });

    return token;
  } catch (error) {
    return {
      status: HTTP_STATUS_INTERNAL_SERVER_ERROR,
      message: HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR],
    };
  }
};
