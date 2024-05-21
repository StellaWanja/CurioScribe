import { User } from "../models/userModel.js";
import {
  duplicateEmailChecker,
  duplicateUsernameChecker,
} from "./schema/user_schema_v1.js";
import { pool } from "../../application/repositories/database.js";
import {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_MESSAGES,
} from "../utils/httpConstants.js";

export const checkEmailExists = async (userData: User) => {
  try {
    const { email }: User = userData;

    const connection = await pool.getConnection();
    const results: any = await connection.query(duplicateEmailChecker, [email]);
    const row = results[0];
    const count = row[0]["count"];
    return count > 0 ? true : false;
  } catch (error) {
    return {
      status: HTTP_STATUS_INTERNAL_SERVER_ERROR,
      message: HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR],
    };
  }
};

export const checkUsernameExists = async (userData: User) => {
  try {
    const { username }: User = userData;
    const connection = await pool.getConnection();
    const results: any = await connection.query(duplicateUsernameChecker, [
      username,
    ]);
    const row = results[0];
    const count = row[0]["count"];
    return count > 0 ? true : false;
  } catch (error) {
    return {
      status: HTTP_STATUS_INTERNAL_SERVER_ERROR,
      message: HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR],
    };
  }
};
