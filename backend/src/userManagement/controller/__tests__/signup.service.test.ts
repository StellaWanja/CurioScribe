import request from "supertest";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { jest } from '@jest/globals'
//import app from "../../../application/app.js";
import makeApp from "../../../application/app.js";
import { checkEmailExists } from "../../repositories/checkUserExistence.js";

dotenv.config();

const createUser = jest.fn()
const app = makeApp({createUser})


const SIGNUP_API_ROUTE = "/user/signup";
// const dbConfig = {
//   host: process.env.MYSQL_HOST,
//   user: process.env.MYSQL_USER,
//   password: process.env.MYSQL_PASSWORD,
//   database: "curioscribeTest",
// };
// let connection: mysql.Connection;

// beforeAll(async () => {
//   try {
//     connection = await mysql.createConnection(dbConfig);
//     console.log("Connected to MySQL database");
//   } catch (error) {
//     console.error("Error connecting to MySQL database:", error);
//     throw error; // Terminate test suite if connection fails
//   }
// });

// afterEach(async () => {
//   try {
//     // Clean up the database
//     await connection.execute("DELETE FROM usersTest");
//     console.log("Disconnected from MySQL database");
//   } catch (error) {
//     console.error(
//       "Error cleaning up or disconnecting from MySQL database:",
//       error
//     );
//   }
// });

describe("Testing signup route", () => {
  describe("given no data is provided", () => {
    it("should return status as 400 and message as Bad Request", async () => {
      const mockData = {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      };
      const res = await request(app).post(SIGNUP_API_ROUTE).send(mockData);
      expect(res.statusCode).toEqual(400);
      expect(res.text).toEqual("Bad Request");
    });
  });

  describe("given the first name is not provided", () => {
    it("should return status as 400 and message as Bad Request", async () => {
      const mockData = {
        firstName: "",
        lastName: "Doe",
        username: "JD",
        email: "jd@test.com",
        password: "Abcd!1234",
        confirmPassword: "Abcd!1234",
      };
      const res = await request(app).post(SIGNUP_API_ROUTE).send(mockData);
      expect(res.statusCode).toEqual(400);
      expect(res.text).toEqual("Bad Request");
    });
  });

  describe("given the last name is not provided", () => {
    it("should return status as 400 and message as Bad Request", async () => {
      const mockData = {
        firstName: "Joe",
        lastName: "",
        username: "JD",
        email: "jd@test.com",
        password: "Abcd!1234",
        confirmPassword: "Abcd!1234",
      };
      const res = await request(app).post(SIGNUP_API_ROUTE).send(mockData);
      expect(res.statusCode).toEqual(400);
      expect(res.text).toEqual("Bad Request");
    });
  });

  describe("given no username is provided", () => {
    it("should return status as 400 and message as Bad Request", async () => {
      const mockData = {
        firstName: "Joe",
        lastName: "Doe",
        username: "",
        email: "jd@test.com",
        password: "Abcd!1234",
        confirmPassword: "Abcd!1234",
      };
      const res = await request(app).post(SIGNUP_API_ROUTE).send(mockData);
      expect(res.statusCode).toEqual(400);
      expect(res.text).toEqual("Bad Request");
    });
  });

  describe("given no email is provided", () => {
    it("should return status as 400 and message as Bad Request", async () => {
      const mockData = {
        firstName: "Joe",
        lastName: "Doe",
        username: "JD",
        email: "",
        password: "Abcd!1234",
        confirmPassword: "Abcd!1234",
      };
      const res = await request(app).post(SIGNUP_API_ROUTE).send(mockData);
      expect(res.statusCode).toEqual(400);
      expect(res.text).toEqual("Bad Request");
    });
  });

  describe("given the email provided is invalid", () => {
    it("should return status as 400 and message as Bad Request", async () => {
      const mockData = {
        firstName: "Joe",
        lastName: "Doe",
        username: "JD",
        email: "jd",
        password: "Abcd!1234",
        confirmPassword: "Abcd!1234",
      };
      const res = await request(app).post(SIGNUP_API_ROUTE).send(mockData);
      expect(res.statusCode).toEqual(400);
      expect(res.text).toEqual("Bad Request");
    });
  });

  describe("given the password provided is invalid", () => {
    it("should return status as 400 and message as Bad Request", async () => {
      const mockData = {
        firstName: "Joe",
        lastName: "Doe",
        username: "JD",
        email: "jd@test.com",
        password: "Abcd",
        confirmPassword: "Abcd",
      };
      const res = await request(app).post(SIGNUP_API_ROUTE).send(mockData);
      expect(res.statusCode).toEqual(400);
      expect(res.text).toEqual("Bad Request");
    });
  });

  describe("given the password provided does not match the confirm password field", () => {
    it("should return status as 400 and message as Bad Request", async () => {
      const mockData = {
        firstName: "Joe",
        lastName: "Doe",
        username: "JD",
        email: "jd@test.com",
        password: "Abcd!1234",
        confirmPassword: "Abcd!123",
      };
      const res = await request(app).post(SIGNUP_API_ROUTE).send(mockData);
      expect(res.statusCode).toEqual(400);
      expect(res.text).toEqual("Bad Request");
    });
  });

  describe("given the user exists in the database", () => {
    it("should check if user exists and return status as 400 and message as Bad Request", async () => {
      const mockData = { email: "jd@test.com" };
      const duplicateEmailChecker = `SELECT COUNT(*) AS count FROM usersTest WHERE email = ?`;
    });
  });
});
