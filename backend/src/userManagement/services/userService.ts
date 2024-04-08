import { Request, Response } from "express";
import { User } from "../models/userModel.js";
import { hashPassword } from "../utils/hashPassword.js";
import { validateInputs } from "../utils/validateInputs.js";
import { addUserToDB } from "../repositories/addUser.js";
import { httpConstants } from "../utils/httpConstants.js";


export const signup = async (req: Request, res: Response) => {
  try {
    const userData: User = req.body;

    // validate data
    const validation = await validateInputs(userData, res);
    if(!validation.success){
      return res.send(validation.error);
    }
    
    //hashed password
    const passwordHashed = await hashPassword(userData);

    /* CHECK IF USER EXISTS -> EMAIL & USERNAME */

    await addUserToDB(userData, passwordHashed);
    return res.send(httpConstants.OK.signupSuccessful);
  } catch (error) {
    console.error("Error signing up:", error);
    return res.send(httpConstants["Server error"]);
  }
};
