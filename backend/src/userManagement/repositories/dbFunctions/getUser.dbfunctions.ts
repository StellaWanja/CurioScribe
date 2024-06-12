import { Response } from "express";
import { pool } from "../../../application/repositories/database.js";
import { User } from "../../models/userModel.js";
import { comparePassword } from "../../utils/hashPassword.js";
import { ParsedQs } from "qs";
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_MESSAGES,
} from "../../utils/httpResponses.js";
import {
  getUserDetails,
  getUserDetailsWithId,
} from "../schema/user_schema_v1.0.0.js";

export const getUserDetailsFromDB = async (userData: User, res: Response) => {
  try {
    const { email, password }: User = userData;

    // connect to db and get user details
    const connection = await pool.getConnection();
    const [data] = await connection.query(getUserDetails, email);

    // check if passwords match and if they don't return error
    const passwordsMatch = await comparePassword(password, data[0]["password"]);
    if (!passwordsMatch) {
      return res
        .status(HTTP_STATUS_BAD_REQUEST)
        .send(HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST]);
    }

    connection.release();

    return data;
  } catch (error) {
    return {
      status: HTTP_STATUS_INTERNAL_SERVER_ERROR,
      message: HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR],
    };
  }
};

export const getUserDetailsUsingId = async (
  userId: string | ParsedQs | string[] | ParsedQs[],
  res: Response
) => {
  try {
    // connect to db and get user details
    const connection = await pool.getConnection();
    const [data] = await connection.query(getUserDetailsWithId, userId);
    const rows = data[0];

    if (rows === null || rows === undefined) {
      return res
        .status(HTTP_STATUS_BAD_REQUEST)
        .send(HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST]);
    }

    connection.release();
    return data;
  } catch (error) {
    return {
      status: HTTP_STATUS_INTERNAL_SERVER_ERROR,
      message: HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR],
    };
  }
};
