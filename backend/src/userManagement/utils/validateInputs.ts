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

const hasLoginNullValues = (userData: User): boolean => {
  const requiredFields: (keyof User)[] = ["email", "password"]; // Define required fields here
  return requiredFields.some((field) => !userData[field]);
};

const hasEmailNullValues = (userData: User): boolean => {
  const requiredFields: (keyof User)[] = ["email"]; // Define required fields here
  return requiredFields.some((field) => !userData[field]);
};
const hasPasswordNullValues = (userData: User): boolean => {
  const requiredFields: (keyof User)[] = ["password", "confirmPassword"]; // Define required fields here
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

export const validateSignupInputs = async (
  userData: User
): Promise<{
  success: boolean;
  error?: { statusMessage: string };
}> => {
  try {
    // null values
    if (hasNullValues(userData)) {
      return { success: false, error: httpConstants[400].nullValues };
    }

    // invalid email
    if (emailIsInvalid(userData)) {
      return {
        success: false,
        error: httpConstants[400].invalidEmail,
      };
    }

    // invalid password
    if (passwordIsInvalid(userData)) {
      return {
        success: false,
        error: httpConstants[400].invalidPassword,
      };
    }

    // passwords don't match
    if (passwordMatch(userData)) {
      return {
        success: false,
        error: httpConstants[400].mismatchingPasswords,
      };
    }
    return { success: true };
  } catch (error) {
    throw new Error(error);
  }
};

export const validateLoginInputs = async (
  userData: User
): Promise<{
  success: boolean;
  error?: { statusMessage: string };
}> => {
  try {
    // invalid email
    if (emailIsInvalid(userData)) {
      return {
        success: false,
        error: httpConstants[400].invalidEmail,
      };
    }

    // null values
    if (hasLoginNullValues(userData)) {
      return { success: false, error: httpConstants[400].nullValues };
    }

    // invalid password
    if (passwordIsInvalid(userData)) {
      return {
        success: false,
        error: httpConstants[400].invalidPassword,
      };
    }
    return { success: true };
  } catch (error) {
    throw new Error(error);
  }
};

export const validateEmail = async (
  userEmail: User
): Promise<{
  success: boolean;
  error?: { statusMessage: string };
}> => {
  try {
    // null values
    if (hasEmailNullValues(userEmail)) {
      return { success: false, error: httpConstants[400].nullValues };
    }

    // invalid email
    if (emailIsInvalid(userEmail)) {
      return {
        success: false,
        error: httpConstants[400].invalidEmail,
      };
    }
    return { success: true };
  } catch (error) {
    throw new Error(error);
  }
};

export const validatePasswords = async (
  passwords: User
): Promise<{
  success: boolean;
  error?: { statusMessage: string };
}> => {
  try {
    // null values
    if (hasPasswordNullValues(passwords)) {
      return { success: false, error: httpConstants[400].nullValues };
    }

    // invalid email
    if (passwordIsInvalid(passwords)) {
      return {
        success: false,
        error: httpConstants[400].invalidPassword,
      };
    }

    // passwords don't match
    if (passwordMatch(passwords)) {
      return {
        success: false,
        error: httpConstants[400].mismatchingPasswords,
      };
    }
    return { success: true };
  } catch (error) {
    throw new Error(error);
  }
};
