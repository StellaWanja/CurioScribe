import nodemailer from "nodemailer";
import { pool } from "../../../../application/repositories/database.js";
import {
  sendPasswordResetLink,
  updatePassword,
} from "../../../../userManagement/repositories/dbFunctions/resetPassword.dbfunctions.js";
import {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_MESSAGES,
  HTTP_STATUS_OK,
} from "../../../../userManagement/utils/httpResponses.js";
import {
  getDetsfromOTP,
  resetPassword,
  updateUserOTP,
} from "../../../../userManagement/repositories/schema/user_schema_v1.0.0.js";

jest.mock("../../../../application/repositories/database.ts", () => ({
  pool: {
    getConnection: jest.fn(),
  },
}));

const otp = "123456789";
const otpExpires = new Date();
const userEmail = { email: "test@example.com" };
const mockUserDetails = {
  id: "12345-6789",
  firstName: "John",
  lastName: "Doe",
  username: "test",
  email: "test@example.com",
  password: "hashedPassword@123",
  otp: "mock_token",
};

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

describe("Testing password gets updated after clicking on the link sent via email", () => {
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

  describe("given the hashed password and otp token", () => {
    it("should return true if password is updated successfully", async () => {
      const mock_hashPassword = "mock_hashedPassword";
      const mockOtp = "mock_otp";
      mockConnection.query.mockResolvedValueOnce([mockUserDetails]);

      const result = await updatePassword(mock_hashPassword, mockOtp);

      expect(result).toBe(true);
      expect(pool.getConnection).toHaveBeenCalledTimes(1);
      expect(mockConnection.query).toHaveBeenCalledTimes(2);
      expect(mockConnection.release).toHaveBeenCalledTimes(1);
      expect(mockConnection.query).toHaveBeenCalledWith(getDetsfromOTP, [
        mockOtp,
      ]);
      expect(mockConnection.query).toHaveBeenCalledWith(resetPassword, [
        mock_hashPassword,
        mockOtp,
      ]);
    });

    it('should return undefined when user not found', async () => {  
      const mock_hashPassword = "mock_hashedPassword";
      const mockOtp = "invalidOtp";
      mockConnection.query.mockResolvedValueOnce([]);

      const result = await updatePassword(mock_hashPassword, mockOtp);
  
      expect(result).toBeUndefined();
      expect(pool.getConnection).toHaveBeenCalledTimes(1);
      expect(mockConnection.query).toHaveBeenCalledTimes(1);
      expect(mockConnection.release).toHaveBeenCalledTimes(1);
      expect(mockConnection.query).toHaveBeenCalledWith(getDetsfromOTP, [
        mockOtp,
      ]);
      expect(mockConnection.query).not.toHaveBeenCalledWith(resetPassword, [
        mock_hashPassword,
        mockOtp,
      ]);
    });
  });
});
