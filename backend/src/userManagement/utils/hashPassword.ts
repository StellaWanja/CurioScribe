import bcrypt from "bcrypt";
import { User } from "../models/userModel.js";

export const hashPassword = async (userData: User) => {
  try {
    const {password} = userData;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error(error);
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    const passwordComparison = await bcrypt.compare(password, hashedPassword);
    return passwordComparison;
  } catch (error) {
    throw new Error(error);
  }
};
