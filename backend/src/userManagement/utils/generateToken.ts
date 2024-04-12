import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { Response } from "express";
import { QueryResult } from "mysql2";

export const generateToken = async (
  userInfo: Response<any, Record<string, any>> | QueryResult
): Promise<string> => {
  try {
    const { id, email } = userInfo[0];

    const token = jwt.sign({ userId: id, email: email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return token;
  } catch (error) {
    throw new Error(error);
  }
};
