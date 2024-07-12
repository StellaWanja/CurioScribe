import request from "supertest";
import app from "../../../../application/app.js";
import { checkEmailExists } from "../../../../userManagement/repositories/dbFunctions/checkUserExistence.dbfunctions.js";
import { getUser } from "../../../../userManagement/repositories/dbFunctions/getUser.dbfunctions.js";
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_MESSAGES,
  HTTP_STATUS_OK,
} from "../../../../userManagement/utils/httpResponses.js";
import { generateToken } from "../../../../userManagement/utils/tokens/generateToken.js";
import { validateLoginInputs } from "../../../../userManagement/utils/validations/login.validation.js";

jest.mock(
  "../../../../userManagement/utils/validations/login.validation.ts",
  () => ({
    validateLoginInputs: jest.fn(),
  })
);
jest.mock(
  "../../../../userManagement/repositories/dbFunctions/checkUserExistence.dbfunctions.ts",
  () => ({
    checkEmailExists: jest.fn(),
  })
);
jest.mock(
  "../../../../userManagement/repositories/dbFunctions/getUser.dbfunctions.ts",
  () => ({
    getUser: jest.fn(),
  })
);
jest.mock("../../../../userManagement/utils/tokens/generateToken.ts", () => ({
  generateToken: jest.fn(),
}));

const LOGIN_API_ROUTE = "/auth/login";

const mockData = {
  email: "test@example.com",
  password: "testPassword@123",
};
const mockUserDetails = {
  id: "12345-6789",
  firstName: "John",
  lastName: "Doe",
  username: "test",
  email: "test@example.com",
  password: "hashedPassword@123",
};

describe("Testing login route", () => {
  describe("given the validation fails", () => {
    it("should return 400 and message as Bad Request", async () => {
      (validateLoginInputs as jest.Mock).mockResolvedValue({
        success: false,
        message: HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST],
      });

      const res = await request(app).post(LOGIN_API_ROUTE).send(mockData);

      expect(res.statusCode).toBe(HTTP_STATUS_BAD_REQUEST);
      expect(res.text).toBe(HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST]);
    });
  });

  describe("given the user email does not exist in the database", () => {
    it("should return 400 and message as Bad Request", async () => {
      (validateLoginInputs as jest.Mock).mockResolvedValue({ success: true });
      (checkEmailExists as jest.Mock).mockResolvedValueOnce(false);

      const res = await request(app).post(LOGIN_API_ROUTE).send(mockData);

      expect(res.statusCode).toBe(HTTP_STATUS_BAD_REQUEST);
      expect(res.text).toBe(HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST]);
    });
  });

  describe("given the user info is not retrieved from database and database returns undefined", () => {
    it("should return 400 and message as Bad Request", async () => {
      (validateLoginInputs as jest.Mock).mockResolvedValue({ success: true });
      (checkEmailExists as jest.Mock).mockResolvedValueOnce(true);
      (getUser as jest.Mock).mockResolvedValue(undefined);

      const res = await request(app).post(LOGIN_API_ROUTE).send(mockData);

      expect(res.statusCode).toBe(HTTP_STATUS_BAD_REQUEST);
      expect(res.text).toBe(HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST]);
    });
  });

  describe("given everything works fine", () => {
    it("should login user and set the Authorization header", async () => {
      const mockToken = "mock-jwt-token";
      (validateLoginInputs as jest.Mock).mockResolvedValue({ success: true });
      (checkEmailExists as jest.Mock).mockResolvedValueOnce(true);
      (getUser as jest.Mock).mockResolvedValue([[mockUserDetails]]);
      (generateToken as jest.Mock).mockResolvedValue(mockToken);

      const res = await request(app).post(LOGIN_API_ROUTE).send(mockData);

      expect(res.header).toHaveProperty("authorization");
      expect(res.status).toBe(HTTP_STATUS_OK);
      expect(res.text).toBe(HTTP_STATUS_MESSAGES[HTTP_STATUS_OK]);
    });
  });
});
