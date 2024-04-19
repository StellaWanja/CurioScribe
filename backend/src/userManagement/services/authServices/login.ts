import { Request, Response } from "express";
import { User } from "../../models/userModel.js";
import { checkEmailExists } from "../../utils/userExistsChecker.js";
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_MESSAGES, HTTP_STATUS_OK } from "../../utils/httpConstants.js";
import { getUserDetailsFromDB } from "../../repositories/getUser.js";
import { generateToken } from "../../utils/tokens/generateToken.js";
import { validateLoginInputs } from "../../utils/validations/validateLoginInputs.js";

export const login = async (req: Request, res: Response) => {
    try {
      const userData: User = req.body;
  
      // validate data
      const validation = await validateLoginInputs(userData);
      if (!validation.success) {
        return res.send(validation.error);
      }
  
      // check if user exists
      const emailExists = await checkEmailExists(userData);
      if (!emailExists) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send(HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST]);
      }
  
      // get user details
      const userInfo = await getUserDetailsFromDB(userData, res);
      if (userInfo[0] === undefined) return;
  
      // create jwt
      const token = await generateToken(userInfo);
  
      // login and set token in header
      res.setHeader("Authorization", `Bearer ${token}`);
      return res.status(HTTP_STATUS_OK).send(HTTP_STATUS_MESSAGES[HTTP_STATUS_OK]);
    } catch (error) {
      console.error("Error logging in:", error);
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send(HTTP_STATUS_INTERNAL_SERVER_ERROR);
    }
  };
  