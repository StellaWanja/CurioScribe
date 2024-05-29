import { User } from "../../models/userModel.js";
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_MESSAGES } from "../httpResponses.js";
import { emailIsInvalid, hasEmailNullValues } from "./functions.validations.js";

export const validateEmail = async (
  userEmail: User
): Promise<{
  success: boolean;
  message?: string;
}> => {
  try {
    // null values
    if (hasEmailNullValues(userEmail)) {
      return {
        success: false,
        message: HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST],
      };
    }

    // invalid email
    if (emailIsInvalid(userEmail)) {
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
