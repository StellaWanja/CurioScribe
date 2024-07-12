import { Request, Response } from "express";
import {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_MESSAGES,
  HTTP_STATUS_OK,
  HTTP_STATUS_RESOURCE_EXISTS,
} from "../../utils/httpResponses.js";
import { User } from "../../models/userModel.js";
import { validateLoginInputs } from "../../utils/validations/login.validation.js";
import { checkEmailExists } from "../../repositories/dbFunctions/checkUserExistence.dbfunctions.js";
import { getUser } from "../../repositories/dbFunctions/getUser.dbfunctions.js";
import { generateToken } from "../../utils/tokens/generateToken.js";

const Login = async (req: Request, res: Response) => {
  try {
    const userData: User = req.body;

    // validate data
    const validation = await validateLoginInputs(userData);
    if (!validation.success) {
      return res.status(HTTP_STATUS_BAD_REQUEST).send(validation.message);
    }

    // check if user exists
    const emailExists = await checkEmailExists(userData);
    if (!emailExists) {
      return res
        .status(HTTP_STATUS_BAD_REQUEST)
        .send(HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST]);
    }

    // get user details
    const userInfo = await getUser(userData);
    if (userInfo === undefined) {
      return res
        .status(HTTP_STATUS_BAD_REQUEST)
        .send(HTTP_STATUS_MESSAGES[HTTP_STATUS_BAD_REQUEST]);
    }

    // create jwt
    const userId: string = userInfo[0][0]["id"];
    const userEmail: string = userInfo[0][0]["email"];
    const token = await generateToken(userId, userEmail);   

    // login and set token in header
    res.setHeader("Authorization", `Bearer ${token}`);
    return res
      .status(HTTP_STATUS_OK)
      .send(HTTP_STATUS_MESSAGES[HTTP_STATUS_OK]);
    
  } catch (error) {
    console.error("Error signing up:", error);
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send(HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR]);
  }
};

export default Login;
