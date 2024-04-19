import { Request, Response } from "express";
import { User } from "../../models/userModel.js";
import { addUserToDB } from "../../repositories/addUser.js";
import { getUserDetailsFromDB } from "../../repositories/getUser.js";
import { generateToken } from "../../utils/tokens/generateToken.js";
import { hashPassword } from "../../utils/hashPassword.js";
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_MESSAGES,
  HTTP_STATUS_OK,
} from "../../utils/httpConstants.js";
import {
  checkEmailExists,
  checkUsernameExists,
} from "../../utils/userExistsChecker.js";
import { validateSignupInputs } from "../../utils/validations/validateSignupInputs.js";

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
      return res
        .status(HTTP_STATUS_BAD_REQUEST)
        .send(HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST]);
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

    return res
      .status(HTTP_STATUS_OK)
      .send(HTTP_STATUS_MESSAGES[HTTP_STATUS_OK]);
  } catch (error) {
    console.error("Error signing up:", error);
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send(HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR]);
  }
};
