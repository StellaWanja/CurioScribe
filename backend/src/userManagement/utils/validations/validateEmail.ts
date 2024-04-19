import { User } from "../../models/userModel.js";
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_MESSAGES,
} from "../httpConstants.js";
import { emailIsInvalid, hasEmailNullValues } from "./validationFunctions.js";

export const validateEmail = async (
  userEmail: User
): Promise<{
  success: boolean;
  error?: { status: number; message: string };
}> => {
  try {
    // null values
    if (hasEmailNullValues(userEmail)) {
      return {
        success: false,
        error: {
          status: HTTP_STATUS_BAD_REQUEST,
          message: HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST],
        },
      };
    }

    // invalid email
    if (emailIsInvalid(userEmail)) {
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
