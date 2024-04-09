import { Request, Response } from "express";
import { User } from "../models/userModel.js";
import { hashPassword } from "../utils/hashPassword.js";
import { validateInputs } from "../utils/validateInputs.js";
import { addUserToDB } from "../repositories/addUser.js";
import { httpConstants } from "../utils/httpConstants.js";
import { checkDuplicateEmail, checkDuplicateUsername } from "../repositories/duplicateChecker.js";


export const signup = async (req: Request, res: Response) => {
  try {
    const userData: User = req.body;

    // validate data
    const validation = await validateInputs(userData, res);
    if(!validation.success){
      return res.send(validation.error);
    }
    
    // duplicate check
    const duplicateEmail = await checkDuplicateEmail(userData);     
    if(duplicateEmail){
      return res.send(httpConstants["Bad Request"].duplicateEmail);
    }
    const duplicateUsername = await checkDuplicateUsername(userData);     
    if(duplicateUsername){
      return res.send(httpConstants["Bad Request"].duplicateName);
    }

    // hash password
    const passwordHashed = await hashPassword(userData);

    // send data to db
    await addUserToDB(userData, passwordHashed);
    return res.send(httpConstants.OK.signupSuccessful);
  } catch (error) {
    console.error("Error signing up:", error);
    return res.send(httpConstants["Server error"]);
  }
};
