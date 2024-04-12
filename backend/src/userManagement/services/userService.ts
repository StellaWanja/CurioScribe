import { Request, Response } from "express";
import { User } from "../models/userModel.js";
import { hashPassword } from "../utils/hashPassword.js";
import {
  validateEmail,
  validateLoginInputs,
  validateSignupInputs,
} from "../utils/validateInputs.js";
import { addUserToDB } from "../repositories/addUser.js";
import { httpConstants } from "../utils/httpConstants.js";
import {
  checkEmailExists,
  checkUsernameExists,
} from "../repositories/userExistsChecker.js";
import {
  getUserDetailsFromDB,
  getUserDetailsUsingId,
} from "../repositories/getUser.js";
import { generateToken } from "../utils/generateToken.js";

export const signup = async (req: Request, res: Response) => {
  try {
    const userData: User = req.body;

    // validate data
    const validation = await validateSignupInputs(userData);
    if (!validation.success) {
      return res.send(validation.error);
    }

    // duplicate check
    const duplicateEmail = await checkEmailExists(userData);
    const duplicateUsername = await checkUsernameExists(userData);
    if (duplicateEmail || duplicateUsername) {
      return res.send(httpConstants[400].existingUser);
    }

    // hash password
    const passwordHashed = await hashPassword(userData);

    // send data to db
    await addUserToDB(userData, passwordHashed);

    // get user details
    const userInfo = await getUserDetailsFromDB(userData, res);

    // create jwt
    const token = await generateToken(userInfo);

    // login and set token in header
    res.setHeader("Authorization", `Bearer ${token}`);

    return res.send(httpConstants[200].signupSuccessful);
  } catch (error) {
    console.error("Error signing up:", error);
    return res.send(httpConstants[500]);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const userData: User = req.body;

    // validate data
    const validation = await validateLoginInputs(userData);
    if (!validation.success) {
      return res.send(validation.error);
    }

    // check if user exists
    const emailExists = await checkEmailExists(userData);
    if (!emailExists) {
      return res.send(httpConstants[400].userUnidentified);
    }

    // get user details
    const userInfo = await getUserDetailsFromDB(userData, res);

    // create jwt
    const token = await generateToken(userInfo);

    // login and set token in header
    res.setHeader("Authorization", `Bearer ${token}`);
    return res.send(httpConstants[200].loginSuccessful);
  } catch (error) {
    console.error("Error logging in:", error);
    return res.send(httpConstants["Server error"]);
  }
};

export const userProfile = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;
    const userId = req.query.id;

    if (!token || !token.startsWith("Bearer ") || !userId) {
      return res.send(httpConstants[401].unauthorizedAccess);
    }

    // get user details
    const userInfo = await getUserDetailsUsingId(userId, res);

    return res.send(userInfo);
  } catch (error) {
    return res.send(httpConstants["Server error"]);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const userEmail = req.body;   

    // validate data
    const validation = await validateEmail(userEmail);
    if (!validation.success) {
      return res.send(validation.error);
    }

    // check if user exists
    const emailExists = await checkEmailExists(userEmail);    
    if (!emailExists) {
      return res.send(httpConstants[400].userUnidentified);
    }

    
  } catch (error) {
    return res.send(httpConstants["Server error"]);
  }
};
