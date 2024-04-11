import jwt from "jsonwebtoken";
import { httpConstants } from "./httpConstants.js";

// Middleware to verify the Bearer token and get the user's ID
const verifyToken = async (
  req: { headers: { authorization: any }; user: string | jwt.JwtPayload },
  res: {
    send: (arg0: { statusMessage: string }) => any;
    status: (arg0: number) => {
      (): any;
      new (): any;
      json: { (arg0: { message: string; status: number }): void; new (): any };
    };
  },
  next: () => void
) => {
  try {
    const token = req.headers.authorization; // Get the Bearer token from the Authorization header

    if (!token || !token.startsWith("Bearer ")) {
      return res.send(httpConstants[401].unauthorizedAccess);
    }

    const tokenValue = token.replace("Bearer ", "");
    const decoded = await jwt.verify(tokenValue, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.send(httpConstants[401].unauthorizedAccess);
  }
};

export default verifyToken;
