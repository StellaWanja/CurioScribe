import request from "supertest";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import app from "../../../../application/app.js";
import { checkEmailExists } from "../../../../userManagement/repositories/dbFunctions/checkUserExistence.dbfunctions.js";

dotenv.config();

jest.mock(
  "../../../../userManagement/repositories/dbFunctions/checkUserExistence.dbfunctions.ts",
  () => ({
    checkEmailExists: jest.fn(),
  })
);

const LOGIN_API_ROUTE = "/auth/login";

const mockData = {
  email: "test@example.com",
  password: "testPassword@123",
};

describe("Testing login route", () => {
  describe("given the user email does not exist in the database", () => {
    it("should return 400 and message as Bad Request", async () => {
      (checkEmailExists as jest.Mock).mockResolvedValueOnce(false);
      const res = await request(app).post(LOGIN_API_ROUTE).send(mockData);
      expect(res.status).toBe(400);
      expect(res.text).toBe("Bad Request");
      expect(checkEmailExists).toHaveBeenCalledWith(mockData);
    });
  });

  describe("given the user email does not exist in the database", () => {
    it("should return 400 and message as Bad Request", async () => {
      (checkEmailExists as jest.Mock).mockResolvedValueOnce(false);
      const res = await request(app).post(LOGIN_API_ROUTE).send(mockData);
      expect(res.status).toBe(400);
      expect(res.text).toBe("Bad Request");
      expect(checkEmailExists).toHaveBeenCalledWith(mockData);
    });
  });
});
