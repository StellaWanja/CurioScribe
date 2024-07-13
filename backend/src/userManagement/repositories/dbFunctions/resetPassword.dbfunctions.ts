import nodemailer from "nodemailer";
import { pool } from "../../../application/repositories/database.js";
import {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_MESSAGES,
  HTTP_STATUS_OK,
} from "../../utils/httpResponses.js";
import {
  getDetsfromOTP,
  resetPassword,
  updateUserOTP,
} from "../schema/user_schema_v1.0.0.js";

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

export const updatePassword = async (passwordHash: string, otpToken: string) => {
  try {
    // get data from token if token has not expired
    const connection = await pool.getConnection();
    const results: any = await connection.query(getDetsfromOTP, [otpToken]);
    
    const row = results[0];

    if (!row || row.length === 0) {
      connection.release();
      return;
    }

    // update password
    await connection.query(resetPassword, [passwordHash, otpToken]);

    connection.release();   
    return true;
  } catch (error) {
    return {
      status: HTTP_STATUS_INTERNAL_SERVER_ERROR,
      message: HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR],
    };
  }
};
