import { NextFunction, Request, Response } from "express";
import { User } from "../../models/userModel.js";
import {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_MESSAGES,
  HTTP_STATUS_RESOURCE_EXISTS,
} from "../../utils/httpResponses.js";
import { validateSignup } from "../../utils/validations/signup.validation.js";
import {
  checkEmailExists,
  checkUsernameExists,
} from "../../repositories/dbFunctions/checkUserExistence.dbfunctions.js";
import { hashPassword } from "../../utils/hashPassword.js";
import { addUserToDB } from "../../repositories/dbFunctions/addUser.dbfunctions.js";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userData: User = req.body;

    // validate data
    const validation = await validateSignup(userData);
    if (!validation.success) {
      return res.status(HTTP_STATUS_BAD_REQUEST).send(validation.message);
    }

    // duplicate check
    const emailExists = await checkEmailExists(userData);
    const usernameExists = await checkUsernameExists(userData);
    if (emailExists || usernameExists) {
      return res
        .status(HTTP_STATUS_RESOURCE_EXISTS)
        .send(HTTP_STATUS_MESSAGES[HTTP_STATUS_RESOURCE_EXISTS]);
    }

    // hash password
    const passwordHashed = await hashPassword(userData);
    if (
      passwordHashed &&
      typeof passwordHashed === "object" &&
      "status" in passwordHashed
    ) {
      return res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send(passwordHashed.message);
    }

    // send data to db
    await addUserToDB(userData, passwordHashed);

    // get user details
    const userInfo = await getUserDetailsFromDB(userData, res);
  } catch (error) {
    console.error("Error signing up:", error);
    next(error);
  }
};
