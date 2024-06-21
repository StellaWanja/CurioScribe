import { User } from "../../models/userModel.js";
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_MESSAGES,
} from "../httpResponses.js";
import {
  emailIsInvalid,
  hasLoginNullValues,
  passwordIsInvalid,
} from "./functions.validations.js";

export const validateLoginInputs = async (
  userData: User
): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    // invalid email
    if (emailIsInvalid(userData)) {
      return {
        success: false,
        message: HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST],
      };
    }

    // null values
    if (hasLoginNullValues(userData)) {
      return {
        success: false,
        message: HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST],
      };
    }

    // invalid password
    if (passwordIsInvalid(userData)) {
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
