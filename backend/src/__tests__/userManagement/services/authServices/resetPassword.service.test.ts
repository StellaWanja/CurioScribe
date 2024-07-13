import request from "supertest";
import { updatePassword } from "../../../../userManagement/repositories/dbFunctions/resetPassword.dbfunctions.js";
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_MESSAGES,
  HTTP_STATUS_OK,
} from "../../../../userManagement/utils/httpResponses.js";
import { validatePasswords } from "../../../../userManagement/utils/validations/password.validation.js";
import app from "../../../../application/app.js";
import { hashPassword } from "../../../../userManagement/utils/hashPassword.js";

jest.mock(
  "../../../../userManagement/utils/validations/password.validation.ts",
  () => ({
    validatePasswords: jest.fn(),
  })
);

jest.mock("../../../../userManagement/utils/hashPassword.ts", () => ({
  hashPassword: jest.fn(),
}));

jest.mock(
  "../../../../userManagement/repositories/dbFunctions/resetPassword.dbfunctions.ts",
  () => ({
    updatePassword: jest.fn(),
  })
);

const RESET_PASSWORD_API_ROUTE = "/auth//reset-password";
const mockData = {
  password: "testPassword@123",
  confirmPassword: "testPassword@123",
};

describe("Testing the reset password route ", () => {
  describe("given the validation fails", () => {
    it("should return 400 and message as Bad Request", async () => {
      (validatePasswords as jest.Mock).mockResolvedValue({
        success: false,
        message: HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST],
      });

      const res = await request(app)
        .post(RESET_PASSWORD_API_ROUTE)
        .send(mockData);

      expect(res.statusCode).toBe(HTTP_STATUS_BAD_REQUEST);
      expect(res.text).toBe(HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST]);
    });
  });

  describe("given the password does not get hashed successfully", () => {
    it("should return 500", async () => {
      const errorResponse = {
        status: HTTP_STATUS_INTERNAL_SERVER_ERROR,
        message: HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR],
      };
      (validatePasswords as jest.Mock).mockResolvedValue({ success: true });
      (hashPassword as jest.Mock).mockResolvedValue(errorResponse);

      const res = await request(app)
        .post(RESET_PASSWORD_API_ROUTE)
        .send(mockData);

      expect(res.status).toBe(HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.text).toBe(
        HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR]
      );
    });
  });

  describe("given the password does not get updated successfully", () => {
    it("should return 400", async () => {
      (validatePasswords as jest.Mock).mockResolvedValue({ success: true });
      (hashPassword as jest.Mock).mockResolvedValue("hashed_password");
      (updatePassword as jest.Mock).mockResolvedValue(undefined);

      const res = await request(app)
        .post(RESET_PASSWORD_API_ROUTE)
        .send(mockData);

      expect(res.statusCode).toBe(HTTP_STATUS_BAD_REQUEST);
      expect(res.text).toBe(HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST]);
    });
  });

  describe("given everything works fine", () => {
    it("should sign up a user and set the Authorization header", async () => {
      (validatePasswords as jest.Mock).mockResolvedValue({ success: true });
      (hashPassword as jest.Mock).mockResolvedValue("hashed_password");
      (updatePassword as jest.Mock).mockResolvedValue(true);

      const res = await request(app)
        .post(RESET_PASSWORD_API_ROUTE)
        .send(mockData);

      expect(res.status).toBe(HTTP_STATUS_OK);
      expect(res.text).toBe(HTTP_STATUS_MESSAGES[HTTP_STATUS_OK]);
    });
  });
});
