import { User } from "../../models/userModel.js";
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_MESSAGES,
} from "../httpResponses.js";
import {
  hasPasswordNullValues,
  passwordIsInvalid,
  passwordMatch,
} from "./functions.validations.js";

export const validatePasswords = async (
  passwords: User
): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    // null values
    if (hasPasswordNullValues(passwords)) {
      return {
        success: false,
        message: HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST],
      };
    }

    // invalid password
    if (passwordIsInvalid(passwords)) {
      return {
        success: false,
        message: HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST],
      };
    }

    // passwords don't match
    if (passwordMatch(passwords)) {
      return {
        success: false,
        message: HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST],
      };
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR],
    };
  }
};
