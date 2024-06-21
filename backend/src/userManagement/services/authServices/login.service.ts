import { Request, Response } from 'express'
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_MESSAGES } from '../../utils/httpResponses.js';
import { User } from '../../models/userModel.js';
import { validateLoginInputs } from '../../utils/validations/login.validation.js';

export const Login = async (req: Request, res: Response) => {
  try {
    const userData: User = req.body;
    
    // validate data
    const validation = await validateLoginInputs(userData);
    if (!validation.success) {
      return res.status(HTTP_STATUS_BAD_REQUEST).send(validation.message);
    }
    
  } catch (error) {
    console.error("Error signing up:", error);
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send(HTTP_STATUS_MESSAGES[HTTP_STATUS_INTERNAL_SERVER_ERROR]);
  }
}
