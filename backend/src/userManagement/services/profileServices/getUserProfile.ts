import { Request, Response } from "express";
import { getUserDetailsUsingId } from "../../repositories/getUser.js";
import {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_MESSAGES,
  HTTP_STATUS_UNAUTHORIZED_ACCESS,
} from "../../utils/httpConstants.js";

export const userProfile = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;
    const userId = req.query.id;

    if (!token || !token.startsWith("Bearer ") || !userId) {
      return res
        .status(HTTP_STATUS_UNAUTHORIZED_ACCESS)
        .send(HTTP_STATUS_MESSAGES[HTTP_STATUS_UNAUTHORIZED_ACCESS]);
    }

    // get user details
    const userInfo = await getUserDetailsUsingId(userId, res);

    return res.send(userInfo);
  } catch (error) {
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send(HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR]);
  }
};
