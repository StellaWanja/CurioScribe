import { Request, Response } from "express";
import { validatePasswords } from "../../utils/validations/validatePassword.js";
import { hashPassword } from "../../utils/hashPassword.js";
import { updatePassword } from "../../repositories/resetPassword.js";
import {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_MESSAGES,
  HTTP_STATUS_OK,
} from "../../utils/httpConstants.js";

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

    return res
      .status(HTTP_STATUS_OK)
      .send(HTTP_STATUS_MESSAGES[HTTP_STATUS_OK]);
  } catch (error) {
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send(HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR]);
  }
};
