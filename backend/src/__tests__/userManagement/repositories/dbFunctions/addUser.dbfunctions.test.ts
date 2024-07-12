import { pool } from "../../../../application/repositories/database.js";
import { addUserToDB } from "../../../../userManagement/repositories/dbFunctions/addUser.dbfunctions.js";
import {
  addUser,
  createUsersTable,
} from "../../../../userManagement/repositories/schema/user_schema_v1.0.0.js";
import {
  HTTP_STATUS_MESSAGES,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} from "../../../../userManagement/utils/httpResponses.js";

// mock db connection
jest.mock("../../../../application/repositories/database.ts", () => ({
  pool: {
    getConnection: jest.fn(),
  },
}));

const mockData = {
  firstName: "John",
  lastName: "Doe",
  username: "test",
  email: "test@example.com",
  password: "testPassword@123",
  confirmPassword: "testPassword@123",
};

describe("Testing whether a user is added successfully to a database", () => {
  let mockConnection: any;

  beforeEach(() => {
    mockConnection = {
      execute: jest.fn(),
      release: jest.fn(),
    };
    (pool.getConnection as jest.Mock).mockResolvedValue(mockConnection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("given the user details", () => {
    it("should successfully add a user to the database", async () => {
      mockConnection = {
        query: jest.fn().mockResolvedValueOnce([{}]), // Mock table check
        execute: jest.fn().mockResolvedValueOnce([{}]), // Mock user insertion
        release: jest.fn(),
      };
      (pool.getConnection as jest.Mock).mockResolvedValue(mockConnection);
      const passwordHashed = "hashedPassword@123";
      const userId = "12345-6789";
      await addUserToDB(userId, mockData, passwordHashed);
      expect(mockConnection.query).toHaveBeenCalledWith(createUsersTable);
      expect(mockConnection.execute).toHaveBeenCalledWith(addUser, [
        userId,
        mockData.firstName,
        mockData.lastName,
        mockData.username,
        mockData.email,
        passwordHashed,
      ]);
      expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });

    it("should return an error if database operation fails", async () => {
      mockConnection = {
        query: jest.fn().mockRejectedValueOnce(new Error("DB Error")),
        execute: jest.fn(),
        release: jest.fn(),
      };
      (pool.getConnection as jest.Mock).mockResolvedValue(mockConnection);
      const passwordHashed = "hashedPassword@123";
      const userId = "12345-6789";
      const result = await addUserToDB(userId, mockData, passwordHashed);
      expect(result).toEqual({
        status: HTTP_STATUS_INTERNAL_SERVER_ERROR,
        message: HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR],
      });
      expect(mockConnection.query).toHaveBeenCalledWith(createUsersTable);
      expect(mockConnection.execute).not.toHaveBeenCalledWith();
      expect(mockConnection.release).not.toHaveBeenCalled();
    });
  });
});
