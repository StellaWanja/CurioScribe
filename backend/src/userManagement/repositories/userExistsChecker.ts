import initializeDB from "../../application/repositories/database.js";
import { User } from "../models/userModel.js";
import {
  duplicateEmailChecker,
  duplicateUsernameChecker,
} from "./schema/user_schema_v1.js";

const pool = await initializeDB();
const connection = await pool.getConnection();

export const checkEmailExists = async (userData: User): Promise<boolean> => {
  try {
    const { email }: User = userData;
    const results = await connection.query(duplicateEmailChecker, [email]);

    const row = results[0];
    const count = row[0]["count"];

    return count > 0 ? true : false;
  } catch (error) {
    throw new Error(error);
  }
};

export const checkUsernameExists = async (userData: User): Promise<boolean> => {
  try {
    const { username }: User = userData;
    const results = await connection.query(duplicateUsernameChecker, [
      username,
    ]);

    const row = results[0];
    const count = row[0]["count"];

    return count > 0 ? true : false;
  } catch (error) {
    throw new Error(error);
  }
};

