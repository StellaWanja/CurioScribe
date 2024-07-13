import nodemailer from "nodemailer";
import { pool } from "../../../application/repositories/database.js";
import {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_MESSAGES,
  HTTP_STATUS_OK,
} from "../../utils/httpResponses.js";
import { updateUserOTP } from "../schema/user_schema_v1.0.0.js";

export const sendPasswordResetLink = async (
  otp: string,
  otpExpiry: Date,
  userEmail: { email: string }
) => {
  try {
    const { email } = userEmail;

    const connection = await pool.getConnection();
    await connection.query(updateUserOTP, [otp, otpExpiry, email]);

    const transporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
      },
    });

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Password Reset",
      text: `Click the following link to reset your password: ${process.env.SITE_LINK}/user/reset-password?token=${otp}`,
    };

    const info = await transporter.sendMail(mailOptions);
    return {
      status: HTTP_STATUS_OK,
      message: HTTP_STATUS_MESSAGES[HTTP_STATUS_OK],
    };
  } catch (error) {
    return {
      status: HTTP_STATUS_INTERNAL_SERVER_ERROR,
      message: HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR],
    };
  }
};
