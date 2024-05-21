import { Request, Response } from "express";
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_MESSAGES,
} from "../../utils/httpConstants.js";
import { User } from "../../models/userModel.js";
import { validateSignup } from "../../utils/validations/signup.validation.js";
import { checkEmailExists, checkUsernameExists } from "../../repositories/checkUserExistence.js";

export const signup = async (req: Request, res: Response) => {
  try {
    const userData: User = req.body;

    // validate data
    const validation = await validateSignup(userData);
    if (!validation.success) {
      res.status(HTTP_STATUS_BAD_REQUEST).send(validation.message);
      return;
    }

    // duplicate check
    const emailExists = await checkEmailExists(userData);
    const usernameExists = await checkUsernameExists(userData);
    if (!emailExists || !usernameExists) {
        return res
          .status(HTTP_STATUS_BAD_REQUEST)
          .send(HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST]);
    }
    console.log(emailExists);

  } catch (error) {
    console.error("Error signing up:", error);
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send(HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR]);
  }
};
