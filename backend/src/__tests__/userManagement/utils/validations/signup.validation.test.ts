import request from "supertest";
import app from "../../../../application/app.js";

const SIGNUP_API_ROUTE = "/auth/signup";

describe("Testing signup route validation", () => {
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
      expect(res.statusCode).toBe(400);
      expect(res.text).toBe("Bad Request");
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
      expect(res.statusCode).toBe(400);
      expect(res.text).toBe("Bad Request");
    });
  });
});
