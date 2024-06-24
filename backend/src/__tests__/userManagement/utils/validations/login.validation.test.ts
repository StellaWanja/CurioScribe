import request from "supertest";
import app from "../../../../application/app.js";

const LOGIN_API_ROUTE = "/auth/login";

describe("Testing login route validation", () => {
  describe("given no data is provided", () => {
    it("should return status as 400 and message as Bad Request", async () => {
      const mockData = {
        email: "",
        password: "",
      };
      const res = await request(app).post(LOGIN_API_ROUTE).send(mockData);
      expect(res.statusCode).toBe(400);
      expect(res.text).toBe("Bad Request");
    });
  });

  describe("given the email provided is invalid", () => {
    it("should return status as 400 and message as Bad Request", async () => {
      const mockData = {
        email: "jd",
        password: "Abcd!1234",
      };
      const res = await request(app).post(LOGIN_API_ROUTE).send(mockData);
      expect(res.statusCode).toEqual(400);
      expect(res.text).toEqual("Bad Request");
    });
  });

  describe("given the password provided is invalid", () => {
    it("should return status as 400 and message as Bad Request", async () => {
      const mockData = {
        email: "jd@test.com",
        password: "Abcd",
      };
      const res = await request(app).post(LOGIN_API_ROUTE).send(mockData);
      expect(res.statusCode).toEqual(400);
      expect(res.text).toEqual("Bad Request");
    });
  });
});
