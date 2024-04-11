import { Response } from "express";
import initializeDB from "../../application/repositories/database.js";
import { User } from "../models/userModel.js";
import { comparePassword } from "../utils/hashPassword.js";
import { addUser, getUserDetails } from "./schema/user_schema_v1.js";
import { httpConstants } from "../utils/httpConstants.js";

const pool = await initializeDB();

export const getUserDetailsFromDB = async (userData: User, res:Response) => {
    try {
        const { email, password }: User = userData;

        // connect to db and get user details
        const connection = await pool.getConnection();
        const [data] = await connection.query(getUserDetails, email);

        // check if passwords match and if they don't return error
        const passwordsMatch = await comparePassword(password, data[0]["password"]);
        if(!passwordsMatch){
            return res.send(httpConstants[400].loginError);
        }
        
        return data;
    
        connection.release();
        } catch (error) {
      throw new Error(error);
    }
  };
  