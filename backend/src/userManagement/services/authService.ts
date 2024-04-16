import { Request, Response } from "express";
import crypto from "crypto";
import { User } from "../models/userModel.js";
import {
  validateEmail,
  validateLoginInputs,
  validatePasswords,
  validateSignupInputs,
} from "../utils/validateInputs.js";
import {
  checkEmailExists,
  checkUsernameExists,
} from "../utils/userExistsChecker.js";
import { httpConstants } from "../utils/httpConstants.js";
import { hashPassword } from "../utils/hashPassword.js";
import { addUserToDB } from "../repositories/addUser.js";
import { getUserDetailsFromDB } from "../repositories/getUser.js";
import { generateToken } from "../utils/generateToken.js";
import {
  sendPasswordResetLink,
  updatePassword,
} from "../repositories/resetPassword.js";

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
    if (userInfo[0] === undefined) return;

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

    // Generate a reset token
    const otp = crypto.randomBytes(20).toString("hex");

    const otpExpiry = new Date();
    otpExpiry.setHours(otpExpiry.getHours() + 1); // Token expires in 1 hour

    await sendPasswordResetLink(otp, otpExpiry, userEmail, res);
  } catch (error) {
    return res.send(httpConstants["Server error"]);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const passwords = req.body;
    const otpToken = req.query.token;

    // validate data
    const validation = await validatePasswords(passwords);
    if (!validation.success) {
      return res.send(validation.error);
    }

    // hash password
    const passwordHashed = await hashPassword(passwords);

    await updatePassword(passwordHashed, otpToken, res);

    return res.send(httpConstants[200].passwordReset);
  } catch (error) {
    return res.send(httpConstants["Server error"]);
  }
};
