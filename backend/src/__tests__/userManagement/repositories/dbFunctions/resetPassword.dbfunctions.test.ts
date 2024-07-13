import nodemailer from "nodemailer";
import { pool } from "../../../../application/repositories/database.js";
import {sendPasswordResetLink} from "../../../../userManagement/repositories/dbFunctions/resetPassword.dbfunctions.js";
import {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_MESSAGES,
  HTTP_STATUS_OK,
} from "../../../../userManagement/utils/httpResponses.js";
import { updateUserOTP } from "../../../../userManagement/repositories/schema/user_schema_v1.0.0.js";

jest.mock("../../../../application/repositories/database.ts", () => ({
  pool: {
    getConnection: jest.fn(),
  },
}));

const otp = "123456789";
const otpExpires = new Date();
const userEmail = { email: "test@example.com" };

describe("Testing whether password link is created", () => {
  let mockConnection: any;

  beforeEach(() => {
    mockConnection = {
      query: jest.fn(),
      release: jest.fn(),
    };
    (pool.getConnection as jest.Mock).mockResolvedValue(mockConnection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("given the otp, otp expiry time and email are provided", () => {
    it("should send password reset link successfully", async () => {
      const sendMailMock = jest.fn().mockResolvedValueOnce({});
      jest
        .spyOn(nodemailer, "createTransport")
        .mockReturnValue({ sendMail: sendMailMock } as any);

      const result = await sendPasswordResetLink(otp, otpExpires, userEmail);

      expect(result.status).toBe(HTTP_STATUS_OK);
      expect(result.message).toBe(HTTP_STATUS_MESSAGES[HTTP_STATUS_OK]);
      expect(mockConnection.query).toHaveBeenCalledWith(updateUserOTP, [
        otp,
        otpExpires,
        userEmail.email,
      ]);
      expect(nodemailer.createTransport).toHaveBeenCalled();
      expect(sendMailMock).toHaveBeenCalledWith({
        from: process.env.USER_EMAIL,
        to: userEmail.email,
        subject: "Password Reset",
        text: `Click the following link to reset your password: ${process.env.SITE_LINK}/user/reset-password?token=${otp}`,
      });
    });

    it("should handle errors gracefully", async () => {
      // Mock the database query to throw an error
      mockConnection.query.mockRejectedValue(new Error("DB Error"));
      const sendMailMock = jest.fn().mockResolvedValueOnce({});
      jest
        .spyOn(nodemailer, "createTransport")
        .mockReturnValue({ sendMail: sendMailMock } as any);

      const result = await sendPasswordResetLink(otp, otpExpires, userEmail);

      expect(result.status).toBe(HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(result.message).toBe(
        HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR]
      );
      expect(mockConnection.query).toHaveBeenCalledWith(updateUserOTP, [
        otp,
        otpExpires,
        userEmail.email,
      ]);
      expect(nodemailer.createTransport).not.toHaveBeenCalled();
    });
  });
});
