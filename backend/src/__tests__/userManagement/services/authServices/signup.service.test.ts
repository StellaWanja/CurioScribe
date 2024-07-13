import request from "supertest";
import app from "../../../../application/app.js";
import {
  checkEmailExists,
  checkUsernameExists,
} from "../../../../userManagement/repositories/dbFunctions/checkUserExistence.dbfunctions.js";
import { hashPassword } from "../../../../userManagement/utils/hashPassword.js";
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_MESSAGES,
  HTTP_STATUS_RESOURCE_EXISTS,
} from "../../../../userManagement/utils/httpResponses.js";
import { validateSignupInputs } from "../../../../userManagement/utils/validations/signup.validation.js";

const SIGNUP_API_ROUTE = "/auth/signup";
const mockData = {
  firstName: "John",
  lastName: "Doe",
  username: "test",
  email: "test@example.com",
  password: "testPassword@123",
  confirmPassword: "testPassword@123",
};

jest.mock(
  "../../../../userManagement/utils/validations/signup.validation.ts",
  () => ({
    validateSignupInputs: jest.fn(),
  })
);

jest.mock(
  "../../../../userManagement/repositories/dbFunctions/checkUserExistence.dbfunctions.ts",
  () => ({
    checkEmailExists: jest.fn(),
    checkUsernameExists: jest.fn(),
  })
);

jest.mock("../../../../userManagement/utils/hashPassword.ts", () => ({
  hashPassword: jest.fn(),
}));

describe("Testing signup route", () => {
  describe("given the validation fails", () => {
    it("should return 400 and message as Bad Request", async () => {
      (validateSignupInputs as jest.Mock).mockResolvedValue({
        success: false,
        message: HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST],
      });

      const res = await request(app).post(SIGNUP_API_ROUTE).send(mockData);

      expect(res.statusCode).toBe(HTTP_STATUS_BAD_REQUEST);
      expect(res.text).toBe(HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST]);
    });
  });

  describe("given the user email exists in the database", () => {
    it("should return 409 and message as Resource exists", async () => {
      (validateSignupInputs as jest.Mock).mockResolvedValue({ success: true });
      (checkEmailExists as jest.Mock).mockResolvedValue(true);

      const res = await request(app).post(SIGNUP_API_ROUTE).send(mockData);

      expect(res.statusCode).toBe(HTTP_STATUS_RESOURCE_EXISTS);
      expect(res.text).toBe(HTTP_STATUS_MESSAGES[HTTP_STATUS_RESOURCE_EXISTS]);
    });
  });

  describe("given the username exists in the database", () => {
    it("should return 409 and message as Resource exists", async () => {
      (validateSignupInputs as jest.Mock).mockResolvedValue({ success: true });
      (checkUsernameExists as jest.Mock).mockResolvedValue(true);

      const res = await request(app).post(SIGNUP_API_ROUTE).send(mockData);

      expect(res.statusCode).toBe(HTTP_STATUS_RESOURCE_EXISTS);
      expect(res.text).toBe(HTTP_STATUS_MESSAGES[HTTP_STATUS_RESOURCE_EXISTS]);
    });
  });

  describe("given the password does not get hashed successfully", () => {
    it("should return 409 and message as Resource exists", async () => {
      const errorResponse = {
        status: HTTP_STATUS_INTERNAL_SERVER_ERROR,
        message: HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR],
      };
      (validateSignupInputs as jest.Mock).mockResolvedValue({ success: true });
      (checkEmailExists as jest.Mock).mockResolvedValue(false);
      (checkUsernameExists as jest.Mock).mockResolvedValue(false);
      (hashPassword as jest.Mock).mockResolvedValue(errorResponse);

      const res = await request(app).post(SIGNUP_API_ROUTE).send(mockData);

      expect(res.status).toBe(HTTP_STATUS_INTERNAL_SERVER_ERROR);
      expect(res.text).toBe(
        HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR]
      );
    });
  });

  describe("given everything works fine", () => {
    it("should sign up a user and set the Authorization header", async () => {
      (validateSignupInputs as jest.Mock).mockResolvedValue({ success: true });
      (checkEmailExists as jest.Mock).mockResolvedValue(false);
      (checkUsernameExists as jest.Mock).mockResolvedValue(false);
      (hashPassword as jest.Mock).mockResolvedValue("mock_hashed_password");

      const res = await request(app).post(SIGNUP_API_ROUTE).send(mockData);

      expect(res.status).toBe(HTTP_STATUS_CREATED);
      expect(res.text).toBe(HTTP_STATUS_MESSAGES[HTTP_STATUS_CREATED]);
      expect(res.header).toHaveProperty("authorization");
    });
  });
});
