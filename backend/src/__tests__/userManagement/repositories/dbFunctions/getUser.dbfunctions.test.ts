import { pool } from "../../../../application/repositories/database.js";
import { getUser } from "../../../../userManagement/repositories/dbFunctions/getUser.dbfunctions.js";
import { getUserDetails } from "../../../../userManagement/repositories/schema/user_schema_v1.0.0.js";
import { comparePassword } from "../../../../userManagement/utils/hashPassword.js";
import { HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_MESSAGES } from "../../../../userManagement/utils/httpResponses.js";

jest.mock("../../../../application/repositories/database.ts", () => ({
  pool: {
    getConnection: jest.fn(),
  },
}));

jest.mock("../../../../userManagement/utils/hashPassword.ts", () => ({
  comparePassword: jest.fn(),
}));

const mockInputData = {
  email: "test@example.com",
  password: "testPassword@123",
};
const mockUserDetails = {
  id: "12345-6789",
  firstName: "John",
  lastName: "Doe",
  username: "test",
  email: "test@example.com",
  password: "hashedPassword@123",
};

describe("Testing whether user details are retrieved from database", () => {
  let mockConnection: any;

  beforeEach(() => {
    mockConnection = {
      query: jest.fn(),
      release: jest.fn(),
    };
    (pool.getConnection as jest.Mock).mockResolvedValue(mockConnection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("given the email and passwords", () => {
    it("should return user details if email and password match", async () => {
      const mockQueryResult = [[mockUserDetails]];
      mockConnection.query.mockResolvedValue(mockQueryResult);
      (comparePassword as jest.Mock).mockResolvedValue(true);

      const result = await getUser(mockInputData);

      expect(mockConnection.query).toHaveBeenCalledTimes(1);
      expect(mockConnection.query).toHaveBeenCalledWith(getUserDetails, [
        mockInputData.email,
      ]);
      expect(comparePassword).toHaveBeenCalledWith(
        mockInputData.password,
        "hashedPassword@123"
      );
      expect(result).toEqual(mockQueryResult);
      expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });

    it("should return undefined if email is not found", async () => {
      mockConnection.query.mockResolvedValue([]);
      (comparePassword as jest.Mock).mockResolvedValue(false);

      const result = await getUser(mockInputData);

      expect(mockConnection.query).toHaveBeenCalledTimes(1);
      expect(mockConnection.query).toHaveBeenCalledWith(getUserDetails, [
        mockInputData.email,
      ]);
      expect(result).toBeUndefined();
      expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });

    it("should return undefined if passwords do not match", async () => {
      const mockQueryResult = [[mockUserDetails]];
      mockConnection.query.mockResolvedValue(mockQueryResult);
      (comparePassword as jest.Mock).mockResolvedValue(false);

      const result = await getUser(mockInputData);

      expect(mockConnection.query).toHaveBeenCalledTimes(1);
      expect(mockConnection.query).toHaveBeenCalledWith(getUserDetails, [
        mockInputData.email,
      ]);
      expect(comparePassword).toHaveBeenCalledWith(
        mockInputData.password,
        "hashedPassword@123"
      );
      expect(result).toBeUndefined();
      expect(mockConnection.release).not.toHaveBeenCalled();
    });

    it("should return error object if there are exceptions", async () => {
      mockConnection.query.mockRejectedValue(new Error("DB Error"));

      const result = await getUser(mockInputData);

      expect(result).toEqual({
        status: HTTP_STATUS_INTERNAL_SERVER_ERROR,
        message: HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR],
      });
      expect(mockConnection.release).not.toHaveBeenCalled();
    });
  });
});
