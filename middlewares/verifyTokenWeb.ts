import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import loadConfig from "../utils/types/config.types";
import IUser from "../utils/types/user.types";

type TMyAuthToken = {
  user: {
    UserID: number;
    LastName: string;
    FirstName: string;
    MiddleName: string;
    Username: string;
    Email: string;
    ContactNumber: string;
    Height: number;
    Weight: number;
    ProfilePic: string;
    Gender: string;
    Age: number;
    Address: string;
    Birthday: string;
    SubscriptionType: string;
    Activation: string;
    Password: string;
    ConfirmPassword: string;
    RFIDNumber: string;
    Role: string;
    iat: number;
    exp: number;
  };
};

const verifyWebAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies["accessToken"];

  const config = loadConfig();
  if (!accessToken) {
    return res.status(401).json({
      message: "You are not authenticated in web! Please login again!",
      status: 401,
      isAuthenticated: false,
    });
  }

  jwt.verify(
    accessToken,
    config.ACCESS_TOKEN_SECRET as Secret,
    (
      error: jwt.VerifyErrors | null,
      decoded: string | jwt.JwtPayload | undefined
    ) => {
      if (error)
        return res
          .status(400)
          .json({ error: error, status: 400, isAuthenticated: false });

      const decodedToken = <IUser>decoded;
      if (decodedToken?.Role !== "Admin" && decodedToken?.GuestLogin) {
        return res.status(403).json({
          message: "You are not authorized to view this page!",
          status: 403,
        });
      }

      if (decodedToken?.Role === "User") {
        return res.status(403).json({
          message: "You are not authorized to view this page!",
          status: 403,
        });
      }

      res.locals.payload = decoded;
      res.locals.isAuthenticated = true;
      res.locals.accessToken = accessToken;
      next();
    }
  );
};

export default verifyWebAuthToken;
