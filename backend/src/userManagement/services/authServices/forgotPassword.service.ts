import { Request, Response } from "express";
import crypto from 'crypto';
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_MESSAGES,
} from "../../utils/httpResponses.js";
import { validateEmail } from "../../utils/validations/email.validation.js";
import { checkEmailExists } from "../../repositories/dbFunctions/checkUserExistence.dbfunctions.js";
import sendPasswordResetLink from "../../repositories/dbFunctions/resetPassword.dbfunctions.js";
import { ResponseType } from "../../models/responseType.js";

const ForgotPssword = async (req: Request, res: Response) => {
  try {
    const userEmail = req.body;

    // validate data
    const validation = await validateEmail(userEmail);
    if (!validation.success) {
      return res.status(HTTP_STATUS_BAD_REQUEST).send(validation.message);
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

    const resetLink = await sendPasswordResetLink(otp, otpExpiry, userEmail); 
    return res.status(resetLink.status).send(resetLink.message);
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send(HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR]);
  }
};

export default ForgotPssword;
