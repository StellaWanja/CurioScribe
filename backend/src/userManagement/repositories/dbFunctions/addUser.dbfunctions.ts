import * as uuid from "uuid";
import { pool } from "../../../application/repositories/database.js";
import { User } from "../../models/userModel.js";
import {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_MESSAGES,
} from "../../utils/httpResponses.js";
import { addUser, createUsersTable } from "../schema/user_schema_v1.0.0.js";

export const addUserToDB = async (userData: User, passwordHashed: string) => {
  try {
    const { firstName, lastName, username, email }: User = userData;
    const id:string = uuid.v4();
    const connection = await pool.getConnection();

    // connect to db and check if users table exists
    await connection.query(createUsersTable);

    // send data to db
    const [result] = await connection.execute(addUser, [
      id,
      firstName,
      lastName,
      username,
      email,
      passwordHashed,
    ]);

    connection.release();
  } catch (error) {
    return {
      status: HTTP_STATUS_INTERNAL_SERVER_ERROR,
      message: HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR],
    };
  }
};
