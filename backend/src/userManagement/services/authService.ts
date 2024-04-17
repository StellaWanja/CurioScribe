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
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_MESSAGES, HTTP_STATUS_OK } from "../utils/httpConstants.js";
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
      return res.status(HTTP_STATUS_BAD_REQUEST).send(HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST]);
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

    return res.status(HTTP_STATUS_OK).send(HTTP_STATUS_MESSAGES[HTTP_STATUS_OK]);
  } catch (error) {
    console.error("Error signing up:", error);
    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send(HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR]);
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
      return res.status(HTTP_STATUS_BAD_REQUEST).send(HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST]);
    }

    // get user details
    const userInfo = await getUserDetailsFromDB(userData, res);
    if (userInfo[0] === undefined) return;

    // create jwt
    const token = await generateToken(userInfo);

    // login and set token in header
    res.setHeader("Authorization", `Bearer ${token}`);
    return res.status(HTTP_STATUS_OK).send(HTTP_STATUS_MESSAGES[HTTP_STATUS_OK]);
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send(HTTP_STATUS_INTERNAL_SERVER_ERROR);
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
      return res.status(HTTP_STATUS_BAD_REQUEST).send(HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST]);
    }

    // Generate a reset token
    const otp = crypto.randomBytes(20).toString("hex");

    const otpExpiry = new Date();
    otpExpiry.setHours(otpExpiry.getHours() + 1); // Token expires in 1 hour

    await sendPasswordResetLink(otp, otpExpiry, userEmail, res);
  } catch (error) {
    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send(HTTP_STATUS_INTERNAL_SERVER_ERROR);
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

    return res.status(HTTP_STATUS_OK).send(HTTP_STATUS_MESSAGES[HTTP_STATUS_OK]);
  } catch (error) {
    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send(HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR]);
  }
};
