import { User } from "../../models/userModel.js";
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_MESSAGES } from "../httpConstants.js";
import { emailIsInvalid, hasNullValues, passwordIsInvalid, passwordMatch } from "./validationFunctions.js";

export const validateSignupInputs = async (
  userData: User
): Promise<{
  success: boolean;
  error?: { status: number; message: string };
}> => {
  try {
    // null values
    if (hasNullValues(userData)) {
      return {
        success: false,
        error: {
          status: HTTP_STATUS_BAD_REQUEST,
          message: HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST],
        },
      };
    }

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

    // passwords don't match
    if (passwordMatch(userData)) {
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
