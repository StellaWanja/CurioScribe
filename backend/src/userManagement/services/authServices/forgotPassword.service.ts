import { Request, Response } from "express";
import { User } from "../../models/userModel.js";
import { validateEmail } from "../../utils/validations/email.validation.js";
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_MESSAGES,
  HTTP_STATUS_OK,
} from "../../utils/httpConstants.js";
import { checkEmailExists } from "../../repositories/checkUserExistence.js";

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const userEmail: User = req.body;

    // validate data
    const validation = await validateEmail(userEmail);
    if (!validation.success) {
      res.status(HTTP_STATUS_BAD_REQUEST).send(validation.message);
      return;
    }

    // check if user exists
    const emailExists = await checkEmailExists(userEmail);
    if (!emailExists) {
      return res
        .status(HTTP_STATUS_BAD_REQUEST)
        .send(HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST]);
    }
    console.log(emailExists);
    
    // if (!emailExists) {
    //   return res
    //     .status(HTTP_STATUS_BAD_REQUEST)
    //     .send(HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST]);
    // }


    res.status(HTTP_STATUS_OK).send("ok");
    return;
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send(HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR]);
  }
};
