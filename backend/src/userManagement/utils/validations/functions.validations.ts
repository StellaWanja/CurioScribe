import { User } from "../../models/userModel.js";

const emailRegex = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9]+\.[A-Za-z]/;
const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[#@$!%*?&])[A-Za-z\d#@$!%*?&]{8,}$/;

export const hasNullValues = (userData: User): boolean => {
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

export const hasLoginNullValues = (userData: User): boolean => {
  const requiredFields: (keyof User)[] = ["email", "password"]; // Define required fields here
  return requiredFields.some((field) => !userData[field]);
};

export const hasEmailNullValues = (userData: User): boolean => {
  const requiredFields: (keyof User)[] = ["email"]; // Define required fields here
  return requiredFields.some((field) => !userData[field]);
};

export const hasPasswordNullValues = (userData: User): boolean => {
  const requiredFields: (keyof User)[] = ["password", "confirmPassword"]; // Define required fields here
  return requiredFields.some((field) => !userData[field]);
};

export const emailIsInvalid = (userData: User): boolean => {
  const { email }: User = userData;
  return !emailRegex.test(email);
};

export const passwordIsInvalid = (userData: User): boolean => {
  const { password }: User = userData;
  return !passwordRegex.test(password);
};

export const passwordMatch = (userData: User): boolean => {
  const { password, confirmPassword }: User = userData;
  return password !== confirmPassword;
};
