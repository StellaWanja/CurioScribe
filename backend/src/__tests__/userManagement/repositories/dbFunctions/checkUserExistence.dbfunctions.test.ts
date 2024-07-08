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

// Mock user data
const mockUserEmail = { email: "test@example.com" };
const mockUsername = { username: "test" };
// Mock query results
const mockFalseQueryResult = [[{ count: 0 }]];
const mockTrueQueryResult = [[{ count: 1 }]];

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
      mockConnection.query.mockResolvedValue(mockFalseQueryResult);

      // Call the function with the mock data
      const result = await checkEmailExists(mockUserEmail);

      // Assert that the result is true
      expect(result).toBe(false);
      expect(mockConnection.query).toHaveBeenCalledTimes(1);
      expect(mockConnection.query).toHaveBeenCalledWith(duplicateEmailChecker, [
        mockUserEmail.email,
      ]);
    });
  });

  describe("given the email provided exists in the database", () => {
    it("should return true", async () => {
      mockConnection.query.mockResolvedValue(mockTrueQueryResult);

      const result = await checkEmailExists(mockUserEmail);

      // Assert that the result is true
      expect(result).toBe(true);
      expect(mockConnection.query).toHaveBeenCalledTimes(1);
      expect(mockConnection.query).toHaveBeenCalledWith(duplicateEmailChecker, [
        mockUserEmail.email,
      ]);
    });
  });

  describe("given the username provided does not exist in the database", () => {
    it("should return false", async () => {
      mockConnection.query.mockResolvedValue(mockFalseQueryResult);

      // Call the function with the mock data
      const result = await checkUsernameExists(mockUsername);

      // Assert that the result is true
      expect(result).toBe(false);
      expect(mockConnection.query).toHaveBeenCalledTimes(1);
      expect(mockConnection.query).toHaveBeenCalledWith(
        duplicateUsernameChecker,
        [mockUsername.username]
      );
    });
  });

  describe("given the username provided exists in the database", () => {
    it("should return true", async () => {
      mockConnection.query.mockResolvedValue(mockTrueQueryResult);

      // Call the function with the mock data
      const result = await checkUsernameExists(mockUsername);

      // Assert that the result is true
      expect(result).toBe(true);
      expect(mockConnection.query).toHaveBeenCalledTimes(1);
      expect(mockConnection.query).toHaveBeenCalledWith(
        duplicateUsernameChecker,
        [mockUsername.username]
      );
    });
  });
});
