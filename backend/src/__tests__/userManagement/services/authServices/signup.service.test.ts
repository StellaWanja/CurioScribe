import request from "supertest";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import app from "../../../../application/app.js";
import {
  checkEmailExists,
  checkUsernameExists,
} from "../../../../userManagement/repositories/dbFunctions/checkUserExistence.dbfunctions.js";
import { hashPassword } from "../../../../userManagement/utils/hashPassword.js";

dotenv.config();

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

const SIGNUP_API_ROUTE = "/auth/signup";
const mockData = {
  firstName: "John",
  lastName: "Doe",
  username: "JD",
  email: "test@example.com",
  password: "Abcd!1234",
  confirmPassword: "Abcd!1234",
};
const jwtSecret = process.env.JWT_SECRET as string;

describe("Testing signup route", () => {
  describe("given the user email exists in the database", () => {
    it("should return 409 and message as Resource exists", async () => {
      (checkEmailExists as jest.Mock).mockResolvedValueOnce(true);
      const res = await request(app).post(SIGNUP_API_ROUTE).send(mockData);
      expect(res.status).toBe(409);
      expect(res.text).toBe("Resource exists");
      expect(checkEmailExists).toHaveBeenCalledWith(mockData);
    });
  });

  describe("given the username exists in the database", () => {
    it("should return 409 and message as Resource exists", async () => {
      (checkUsernameExists as jest.Mock).mockResolvedValueOnce(true);
      const res = await request(app).post(SIGNUP_API_ROUTE).send(mockData);
      expect(res.status).toBe(409);
      expect(res.text).toBe("Resource exists");
      expect(checkUsernameExists).toHaveBeenCalledWith(mockData);
    });
  });

  describe("given the password does not get hashed successfully", () => {
    it("should return 409 and message as Resource exists", async () => {
      const errorResponse = {
        status: 500,
        message: "Internal server error",
      };
      (hashPassword as jest.Mock).mockResolvedValueOnce(errorResponse);
      const res = await request(app).post(SIGNUP_API_ROUTE).send(mockData);
      expect(res.status).toBe(500);
      expect(res.text).toBe("Internal server error");
      expect(hashPassword).toHaveBeenCalledWith(mockData);
    });
  });

  describe("given everything works fine", () => {
    it("should sign up a user and set the Authorization header", async () => {
      const res = await request(app).post(SIGNUP_API_ROUTE).send(mockData);
      const token = res.header['authorization'].split(' ')[1];
      const tokenPayload = jwt.verify(token, jwtSecret);

      expect(res.status).toBe(201);
      expect(res.header).toHaveProperty('authorization')
      expect(tokenPayload).toMatchObject({ email: mockData.email }); // contains at least the property email
    });
  });
});
