import request from "supertest";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import app from "../../../application/app.js";

dotenv.config();

const FORGOT_PASSWORD_API_ROUTE = "/user/forgot-password";
const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: "curioscribeTest",
};
let connection: mysql.Connection;

beforeAll(async () => {
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log("Connected to MySQL database");
  } catch (error) {
    console.error("Error connecting to MySQL database:", error);
    throw error; // Terminate test suite if connection fails
  }
});

afterEach(async () => {
  try {
    // Clean up the database
    await connection.execute("DELETE FROM usersTest");
    console.log("Disconnected from MySQL database");
  } catch (error) {
    console.error('Error cleaning up or disconnecting from MySQL database:', error);
  }
});

describe("Testing forgot password route", () => {
  describe("given the email is not provided", () => {
    it("should return status as 400 and message as Bad Request", async () => {
      const mockData = { email: "" };
      const res = await request(app)
        .post(FORGOT_PASSWORD_API_ROUTE)
        .send(mockData);
      expect(res.statusCode).toEqual(400);
      expect(res.text).toEqual("Bad Request");
    });
  });

  describe("given the email provided is invalid", () => {
    it("should return status as 400 and message as Bad Request", async () => {
      const mockData = { email: "test.com" };
      const res = await request(app)
        .post(FORGOT_PASSWORD_API_ROUTE)
        .send(mockData);
      expect(res.statusCode).toEqual(400);
      expect(res.text).toEqual("Bad Request");
    });
  });

  describe("given the user does not exist in the database", () => {
    it("should check if user exists and return status as 400 and message as Bad Request", async () => {
      const mockData = { email: "test@test.ke" };
      const duplicateEmailChecker = `SELECT COUNT(*) AS count FROM usersTest WHERE email = ?`;
      const user = await connection.query(duplicateEmailChecker, [mockData.email]);
      console.log(user)
    });
  });
});
