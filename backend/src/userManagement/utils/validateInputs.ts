import { Response } from "express";
import { User } from "../models/userModel.js";
import { httpConstants } from "./httpConstants.js";

const emailRegex = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9]+\.[A-Za-z]/;
const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/;

const hasNullValues = (userData: User): boolean => {
  const requiredFields: (keyof User)[] = [
    "firstName",
    "lastName",
    "username",
    "email",
    "password",
    "confirmPassword",
  ]; // Define required fields here
  return requiredFields.some((field) => !userData[field]);
};

const emailIsInvalid = (userData: User): boolean => {
  const { email }: User = userData;
  return !emailRegex.test(email);
};

const passwordIsInvalid = (userData: User): boolean => {
  const { password }: User = userData;
  return !passwordRegex.test(password);
};

const passwordMatch = (userData: User): boolean => {
  const { password, confirmPassword }: User = userData;
  return password !== confirmPassword;
};

export const validateInputs = async (
  userData: User,
  res: Response
): Promise<{
  success: boolean;
  error?: { statusCode: number; statusMessage: string };
}> => {
  try {
    // null values
    if (hasNullValues(userData)) {
      return { success: false, error: httpConstants["Bad Request"].nullValues };
    }

    // invalid email
    if (emailIsInvalid(userData)) {
      return {
        success: false,
        error: httpConstants["Bad Request"].invalidEmail,
      };
    }

    // invalid password
    if (passwordIsInvalid(userData)) {
      return {
        success: false,
        error: httpConstants["Bad Request"].invalidPassword,
      };
    }

    // passwords don't match
    if (passwordMatch(userData)) {
      return {
        success: false,
        error: httpConstants["Bad Request"].mismatchingPasswords,
      };
    }

    return { success: true };
  } catch (error) {
    throw new Error(error);
  }
};
