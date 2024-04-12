import { Response } from "express";
import initializeDB from "../../application/repositories/database.js";
import { User } from "../models/userModel.js";
import { comparePassword } from "../utils/hashPassword.js";
import { addUser, getUserDetails, getUserDetailsWithId } from "./schema/user_schema_v1.js";
import { httpConstants } from "../utils/httpConstants.js";
import { ParsedQs } from "qs";

const pool = await initializeDB();

export const getUserDetailsFromDB = async (userData: User, res: Response) => {
  try {
    const { email, password }: User = userData;

    // connect to db and get user details
    const connection = await pool.getConnection();
    const [data] = await connection.query(getUserDetails, email);

    // check if passwords match and if they don't return error
    const passwordsMatch = await comparePassword(password, data[0]["password"]);
    if (!passwordsMatch) {
      return res.send(httpConstants[400].loginError);
    }

    connection.release();
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getUserDetailsUsingId = async (userId: string | ParsedQs | string[] | ParsedQs[], res: Response) => {
  try {
    // connect to db and get user details
    const connection = await pool.getConnection();
    const [data] = await connection.query(getUserDetailsWithId, userId);
    const rows = data[0];

    if(rows === null || rows === undefined){
      return res.send(httpConstants[400].userUnidentified)
    }
    
    connection.release();
    return data;
  } catch (error) {
    throw new Error(error);
  }
};