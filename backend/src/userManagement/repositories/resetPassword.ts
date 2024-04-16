import { Response } from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import initializeDB from "../../application/repositories/database.js";
import { User } from "../models/userModel.js";
import {
  getDetsfromOTP,
  resetPassword,
  updateUserOTP,
} from "./schema/user_schema_v1.js";
import { httpConstants } from "../utils/httpConstants.js";
import { FieldPacket, RowDataPacket } from "mysql2";

const pool = await initializeDB();
const connection = await pool.getConnection();
dotenv.config();

//send password token to email
export const sendPasswordResetLink = async (
  otp: string,
  otpExpiry: Date,
  userEmail: User,
  res: Response
) => {
  try {
    const { email }: User = userEmail;

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
      text: `Click the following link to reset your password: http://localhost:8080/user/reset-password?token=${otp}`,
    };

    await transporter.sendMail(
      mailOptions,
      (error: string, info: { response }) => {
        if (error) {
          console.log("my error is" + error);
          res.send(httpConstants[500].sendingResetEmail);
        } else {
          console.log(`Email sent: ${info.response}`);
          res.send(httpConstants[200].resetEmailSent);
        }
      }
    );
  } catch (error) {
    throw new Error(error);
  }
};

export const updatePassword = async (
  passwordHash: User,
  otpToken,
  res: Response
) => {
  try {
    // get data from token if token has not expired
    const [rows, fields]: [RowDataPacket[], FieldPacket[]] =
      await connection.query(getDetsfromOTP, [otpToken]);

    if (rows.length <= 0) {
      res.send(httpConstants[400].otpError);
    }
    
    // update password
    await connection.query(resetPassword, [passwordHash, otpToken]);
  } catch (error) {
    throw new Error(error);
  }
};
