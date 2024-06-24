import { pool } from "../../../application/repositories/database.js";
import { comparePassword } from "../../utils/hashPassword.js";
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_MESSAGES,
} from "../../utils/httpResponses.js";
import { getUserDetails } from "../schema/user_schema_v1.0.0.js";

export const getUser = async (userData: {
  email: string;
  password: string;
}) => {
  try {
    const { email, password } = userData;

    // connect to db and get user details
    const connection = await pool.getConnection();
    const results: any = await connection.query(getUserDetails, [email]);
    const row = results[0];
    const retrievedPassword: string = row[0]["password"];

    // check if passwords match and if they don't return error
    const passwordsMatch = await comparePassword(password, retrievedPassword);
    if (!passwordsMatch) return;

    connection.release();

    return results;
  } catch (error) {
    return {
      status: HTTP_STATUS_INTERNAL_SERVER_ERROR,
      message: HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR],
    };
  }
};
