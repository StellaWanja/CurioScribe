import { pool } from "../../../application/repositories/database.js";
import { checkEmailExists } from "../../../userManagement/repositories/dbFunctions/verifyEmail.dbfunctions.js";
import { duplicateEmailChecker } from "../../../userManagement/repositories/schema/user_schema_v1.0.0.js";

// mock db connection
jest.mock("../../../application/repositories/database.ts", () => ({
  pool: {
    getConnection: jest.fn(),
  },
}));

describe("Testing email verification", () => {
  let mockConnection: { query: any }; // mock object that simulates the behavior of a real database connection

  beforeEach(() => {
    // create a mock connection object with a query method
    // jest.fn() creates a new mock function for query. This allows one to control how the query method behaves and verify its calls within each test.
    mockConnection = {
      query: jest.fn(),
    };
    // mockResolvedValue(mockConnection) tells the mock getConnection method to return mockConnection whenever it is called. This simulates a successful database connection
    (pool.getConnection as jest.Mock).mockResolvedValue(mockConnection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("given the email provided does not exist in the database", () => {
    test("should return false", async () => {
      const mockUserData = { email: "test@example.com" }; // Mock user data
      const mockQueryResult = [[{ count: 0 }]]; // Mock the query result

      // Mock the connection's query method, set the mock function to return a resolved promise when it is called. The resolved promise will contain mockQueryResult.
      // able to simulate different responses from the database without actually querying a real database
      mockConnection.query.mockResolvedValue(mockQueryResult);

      // Call the function with the mock data
      const result = await checkEmailExists(mockUserData);
      
      // Assert that the result is true
      expect(result).toBe(false);
      expect(mockConnection.query).toHaveBeenCalledTimes(1);
      expect(mockConnection.query).toHaveBeenCalledWith(duplicateEmailChecker, [
        "test@example.com",
      ]);
    });
  });
});
