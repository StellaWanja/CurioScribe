import { pool } from "../../../../application/repositories/database.js";
import { User } from "../../../../userManagement/models/userModel.js";
import { getUserDetailsFromDB } from "../../../../userManagement/repositories/dbFunctions/getUser.dbfunctions.js";
import { getUserDetails } from "../../../../userManagement/repositories/schema/user_schema_v1.0.0.js";
import { comparePassword } from "../../../../userManagement/utils/hashPassword.js";

jest.mock("../../../../application/repositories/database.ts", () => ({
  pool: {
    getConnection: jest.fn(),
  },
}));

jest.mock("../../../../userManagement/utils/hashPassword.ts", () => ({
  comparePassword: jest.fn(),
}));

const mockData: User = {
  id: "10001",
  firstName: "John",
  lastName: "Doe",
  username: "JD",
  email: "test@example.com",
  password: "Abcd!1234",
  confirmPassword: "Abcd!1234",
};

describe("Testing whether user details can be successfully retrieved from the database", () => {
  let mockConnection: any;

  beforeEach(() => {
    mockConnection = {
      query: jest.fn(),
    };

    (pool.getConnection as jest.Mock).mockResolvedValue(mockConnection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("given the user details", () => {
    it("should return user details if passwords match", async () => {
      (comparePassword as jest.Mock).mockResolvedValue(true);
      mockConnection.query.mockResolvedValue([[mockData]]);

      const result = await getUserDetailsFromDB(mockData);
      console.log(result);

      expect(result).toEqual([mockData]);
      expect(mockConnection.query).toHaveBeenCalledWith(getUserDetails, [
        mockData.email,
      ]);
    });

    it("should return error if passwords do not match", async () => {
      (comparePassword as jest.Mock).mockResolvedValue(false); // Password mismatch
      mockConnection.query.mockResolvedValue([[mockData]]);

      const result = await getUserDetailsFromDB(mockData);

      expect(result).toEqual({
        status: 400,
        message: "Bad Request",
      });
      expect(mockConnection.query).toHaveBeenCalledWith(getUserDetails, [
        mockData.email,
      ]);
    });
  });
});
