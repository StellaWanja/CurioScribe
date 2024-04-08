import initializeDB from "../../application/repositories/database.js";
import { User } from "../models/userModel.js";
import { addUser, createUsersTable } from "./schema/user_schema_v1.js";

const pool = await initializeDB();

export const addUserToDB = async (userData: User, passwordHashed: string) => {
  try {
    const { firstName, lastName, username, email }: User = userData;

    // connect to db and check if users table exists
    const connection = await pool.getConnection();
    await connection.query(createUsersTable);

    // send data to db
    const [result] = await connection.execute(addUser, [
      firstName,
      lastName,
      username,
      email,
      passwordHashed,
    ]);

    connection.release();
  } catch (error) {
    throw new Error(error);
  }
};
