import { User } from "../../models/userModel.js";
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_MESSAGES,
} from "../httpConstants.js";
import {
  emailIsInvalid,
  hasLoginNullValues,
  passwordIsInvalid,
} from "./validationFunctions.js";

export const validateLoginInputs = async (
  userData: User
): Promise<{
  success: boolean;
  error?: { status: number; message: string };
}> => {
  try {
    // invalid email
    if (emailIsInvalid(userData)) {
      return {
        success: false,
        error: {
          status: HTTP_STATUS_BAD_REQUEST,
          message: HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST],
        },
      };
    }

    // null values
    if (hasLoginNullValues(userData)) {
      return {
        success: false,
        error: {
          status: HTTP_STATUS_BAD_REQUEST,
          message: HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST],
        },
      };
    }

    // invalid password
    if (passwordIsInvalid(userData)) {
      return {
        success: false,
        error: {
          status: HTTP_STATUS_BAD_REQUEST,
          message: HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST],
        },
      };
    }
    return { success: true };
  } catch (error) {
    throw new Error(error);
  }
};
