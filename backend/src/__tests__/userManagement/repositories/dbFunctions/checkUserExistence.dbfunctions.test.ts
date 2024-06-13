import { pool } from "../../../../application/repositories/database.js";
import {
  checkEmailExists,
  checkUsernameExists,
} from "../../../../userManagement/repositories/dbFunctions/checkUserExistence.dbfunctions.js";
import {
  duplicateEmailChecker,
  duplicateUsernameChecker,
} from "../../../../userManagement/repositories/schema/user_schema_v1.0.0.js";

jest.mock("../../../../application/repositories/database.ts", () => ({
  pool: {
    getConnection: jest.fn(),
  },
}));

describe("Testing whether a user exists in database", () => {
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

  describe("given the email provided does not exist in the database", () => {
    it("should return false", async () => {
      const mockUserData = { email: "test@example.com" }; 
      const mockQueryResult = [[{ count: 0 }]]; // Mock the query result

      mockConnection.query.mockResolvedValue(mockQueryResult);

      // Call the function with the mock data
      const result = await checkEmailExists(mockUserData);

      // Assert that the result is true
      expect(result).toBe(false);
      expect(mockConnection.query).toHaveBeenCalledTimes(1);
      expect(mockConnection.query).toHaveBeenCalledWith(duplicateEmailChecker, [
        mockUserData.email,
      ]);
    });
  });


  describe("given the email provided exists in the database", () => {
    it("should return true", async () => {
      const mockUserData = { email: "test@example.com" }; // Mock user data
      const mockQueryResult = [[{ count: 1 }]]; // Mock the query result

      mockConnection.query.mockResolvedValue(mockQueryResult);

      const result = await checkEmailExists(mockUserData);

      // Assert that the result is true
      expect(result).toBe(true);
      expect(mockConnection.query).toHaveBeenCalledTimes(1);
      expect(mockConnection.query).toHaveBeenCalledWith(duplicateEmailChecker, [
        mockUserData.email,
      ]);
    });
  });

  describe("given the username provided does not exist in the database", () => {
    it("should return false", async () => {
      const mockUserData = { username: "example" }; // Mock user data
      const mockQueryResult = [[{ count: 0 }]]; // Mock the query result

      mockConnection.query.mockResolvedValue(mockQueryResult);

      // Call the function with the mock data
      const result = await checkUsernameExists(mockUserData);

      // Assert that the result is true
      expect(result).toBe(false);
      expect(mockConnection.query).toHaveBeenCalledTimes(1);
      expect(mockConnection.query).toHaveBeenCalledWith(
        duplicateUsernameChecker,
        [mockUserData.username]
      );
    });
  });

  describe("given the username provided exists in the database", () => {
    it("should return false", async () => {
      const mockUserData = { username: "example" }; // Mock user data
      const mockQueryResult = [[{ count: 1 }]]; // Mock the query result

      mockConnection.query.mockResolvedValue(mockQueryResult);

      // Call the function with the mock data
      const result = await checkUsernameExists(mockUserData);

      // Assert that the result is true
      expect(result).toBe(true);
      expect(mockConnection.query).toHaveBeenCalledTimes(1);
      expect(mockConnection.query).toHaveBeenCalledWith(
        duplicateUsernameChecker,
        [mockUserData.username]
      );
    });
  });
});
