import { Request, Response } from "express";
import { validatePasswords } from "../../utils/validations/password.validation.js";
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_MESSAGES,
  HTTP_STATUS_OK,
} from "../../utils/httpResponses.js";
import { hashPassword } from "../../utils/hashPassword.js";
import { updatePassword } from "../../repositories/dbFunctions/resetPassword.dbfunctions.js";

const ResetPassword = async (req: Request, res: Response) => {
  try {
    const passwords = req.body;
    const otpToken = req.query.token as string;

    // validate data
    const validation = await validatePasswords(passwords);
    if (!validation.success) {
      return res.status(HTTP_STATUS_BAD_REQUEST).send(validation.message);
    }

    // hash password
    const passwordHashed = await hashPassword(passwords);
    if (
      passwordHashed &&
      typeof passwordHashed === "object" &&
      "status" in passwordHashed
    ) {
      return res.status(passwordHashed.status).send(passwordHashed.message);
    }

    const updatedPassword = await updatePassword(passwordHashed, otpToken);
    if (updatedPassword === undefined || !updatePassword) {
      return res
        .status(HTTP_STATUS_BAD_REQUEST)
        .send(HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST]);
    }

    return res
      .status(HTTP_STATUS_OK)
      .send(HTTP_STATUS_MESSAGES[HTTP_STATUS_OK]);
  } catch (error) {
    console.error("Error updating password:", error);
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send(HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR]);
  }
};

export default ResetPassword;
