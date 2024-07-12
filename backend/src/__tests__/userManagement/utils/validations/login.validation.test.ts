import request from "supertest";
import app from "../../../../application/app.js";
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_MESSAGES } from "../../../../userManagement/utils/httpResponses.js";

const LOGIN_API_ROUTE = "/auth/login";

describe("Testing login route validation", () => {
  describe("given no data is provided", () => {
    it("should return status as 400 and message as Bad Request", async () => {
      const mockData = {
        email: "",
        password: "",
      };
      const res = await request(app).post(LOGIN_API_ROUTE).send(mockData);
      expect(res.statusCode).toBe(HTTP_STATUS_BAD_REQUEST);
      expect(res.text).toBe(HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST]);
    });
  });

  describe("given the email provided is invalid", () => {
    it("should return status as 400 and message as Bad Request", async () => {
      const mockData = {
        email: "jd",
        password: "Abcd!1234",
      };
      const res = await request(app).post(LOGIN_API_ROUTE).send(mockData);
      expect(res.statusCode).toBe(HTTP_STATUS_BAD_REQUEST);
      expect(res.text).toBe(HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST]);
    });
  });

  describe("given the password provided is invalid", () => {
    it("should return status as 400 and message as Bad Request", async () => {
      const mockData = {
        email: "jd@test.com",
        password: "Abcd",
      };
      const res = await request(app).post(LOGIN_API_ROUTE).send(mockData);
      expect(res.statusCode).toBe(HTTP_STATUS_BAD_REQUEST);
      expect(res.text).toBe(HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST]);
    });
  });
});
