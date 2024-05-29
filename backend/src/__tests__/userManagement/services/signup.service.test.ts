import request from "supertest";
import mysql from "mysql2/promise";
import { pool } from "../../../application/repositories/database.js";
import app from "../../../application/app.js";

// mock db connection
jest.mock("../../../application/repositories/database.ts", () => ({
  pool: {
    getConnection: jest.fn(),
  },
}));

const SIGNUP_API_ROUTE = "/auth/signup";


describe("Testing signup route", () => {
  let mockConnection: { query: any };

  beforeEach(() => {
    mockConnection = {
      query: jest.fn(),
    };
    (pool.getConnection as jest.Mock).mockResolvedValue(mockConnection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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

  describe("given the user email does not exist in the database", () => {
    it("should return status as 400 and message as Bad Request", async () => {
      const mockData = { email: "test@test.com" };
    });
  });
});
