import { Request, Response } from "express";
import crypto from "crypto";
import { validateEmail } from "../../utils/validations/validateEmail.js";
import { checkEmailExists } from "../../utils/userExistsChecker.js";
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_MESSAGES,
} from "../../utils/httpConstants.js";
import { sendPasswordResetLink } from "../../repositories/resetPassword.js";

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
      return res
        .status(HTTP_STATUS_BAD_REQUEST)
        .send(HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST]);
    }

    // Generate a reset token
    const otp = crypto.randomBytes(20).toString("hex");

    const otpExpiry = new Date();
    otpExpiry.setHours(otpExpiry.getHours() + 1); // Token expires in 1 hour

    await sendPasswordResetLink(otp, otpExpiry, userEmail, res);
  } catch (error) {
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send(HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }
};
