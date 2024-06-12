import bcrypt from "bcrypt";
import { User } from "../models/userModel.js";
import {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_MESSAGES,
} from "./httpResponses.js";

export const hashPassword = async (userData: User) => {
  try {
    const { password } = userData;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    return {
      status: HTTP_STATUS_INTERNAL_SERVER_ERROR,
      message: HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR],
    };
  }
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  try {
    const passwordComparison = await bcrypt.compare(password, hashedPassword);
    return passwordComparison;
  } catch (error) {
    return {
      status: HTTP_STATUS_INTERNAL_SERVER_ERROR,
      message: HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR],
    };
  }
};
