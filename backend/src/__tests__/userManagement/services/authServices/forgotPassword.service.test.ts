import request from "supertest";
import app from "../../../../application/app.js";
import { validateEmail } from "../../../../userManagement/utils/validations/email.validation.js";
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_MESSAGES,
  HTTP_STATUS_OK,
} from "../../../../userManagement/utils/httpResponses.js";
import { checkEmailExists } from "../../../../userManagement/repositories/dbFunctions/checkUserExistence.dbfunctions.js";
import { sendPasswordResetLink } from "../../../../userManagement/repositories/dbFunctions/resetPassword.dbfunctions.js";

const FORGOT_PASSWORD_API_ROUTE = "/auth/forgot-password";

const mockEmail = { email: "test@example.com" };

jest.mock(
  "../../../../userManagement/utils/validations/email.validation.ts",
  () => ({
    validateEmail: jest.fn(),
  })
);

jest.mock(
  "../../../../userManagement/repositories/dbFunctions/checkUserExistence.dbfunctions.ts",
  () => ({
    checkEmailExists: jest.fn(),
  })
);

jest.mock(
  "../../../../userManagement/repositories/dbFunctions/resetPassword.dbfunctions.ts",
  () => ({
    sendPasswordResetLink: jest.fn(),
  })
);

describe("Testing forgot password route", () => {
  describe("given the validation fails", () => {
    it("should return 400 and message as Bad Request", async () => {
      (validateEmail as jest.Mock).mockResolvedValue({
        success: false,
        message: HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST],
      });

      const res = await request(app)
        .post(FORGOT_PASSWORD_API_ROUTE)
        .send(mockEmail);

      expect(res.statusCode).toBe(HTTP_STATUS_BAD_REQUEST);
      expect(res.text).toBe(HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST]);
    });
  });

  describe("given the user email does not exist in the database", () => {
    it("should return 400 and message as Bad Request", async () => {
      (validateEmail as jest.Mock).mockResolvedValue({ success: true });
      (checkEmailExists as jest.Mock).mockResolvedValueOnce(false);

      const res = await request(app)
        .post(FORGOT_PASSWORD_API_ROUTE)
        .send(mockEmail);

      expect(res.statusCode).toBe(HTTP_STATUS_BAD_REQUEST);
      expect(res.text).toBe(HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST]);
    });
  });

  describe("given everything works fine", () => {
    it("should send reset token and return 200", async () => {
      (validateEmail as jest.Mock).mockResolvedValue({ success: true });
      (checkEmailExists as jest.Mock).mockResolvedValueOnce(true);
      (sendPasswordResetLink as jest.Mock).mockResolvedValueOnce({
        status: HTTP_STATUS_OK,
        message: HTTP_STATUS_MESSAGES[HTTP_STATUS_OK],
      });

      const res = await request(app)
        .post(FORGOT_PASSWORD_API_ROUTE)
        .send(mockEmail);

        console.log(res);
        

      expect(res.statusCode).toBe(HTTP_STATUS_OK);
      expect(res.text).toBe(HTTP_STATUS_MESSAGES[HTTP_STATUS_OK]);
    });
  });
});
