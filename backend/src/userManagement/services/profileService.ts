import { Request, Response } from "express";
import { httpConstants } from "../utils/httpConstants.js";
import { getUserDetailsUsingId } from "../repositories/getUser.js";

export const userProfile = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;
    const userId = req.query.id;

    if (!token || !token.startsWith("Bearer ") || !userId) {
      return res.send(httpConstants[401].unauthorizedAccess);
    }

    // get user details
    const userInfo = await getUserDetailsUsingId(userId, res);

    return res.send(userInfo);
  } catch (error) {
    return res.send(httpConstants["Server error"]);
  }
};

