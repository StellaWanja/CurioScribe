import { User } from "../../models/userModel.js";
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_MESSAGES,
} from "../httpConstants.js";
import {
  emailIsInvalid,
  hasNullValues,
  passwordIsInvalid,
  passwordMatch,
} from "./functions.validations.js";

export const validateSignup = async (
  userData: User
): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    // null values
    if (hasNullValues(userData)) {
      return {
        success: false,
        message: HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST],
      };
    }

    // invalid email
    if (emailIsInvalid(userData)) {
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

    // passwords don't match
    if (passwordMatch(userData)) {
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
