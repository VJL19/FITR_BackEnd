import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import loadConfig from "../utils/types/config.types";

const verifyWebAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies["accessToken"];

  const config = loadConfig();
  if (!accessToken) {
    return res.status(400).json({
      message: "You are not authenticated in web! Please login again!",
      status: 400,
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

      res.locals.payload = decoded;
      res.locals.isAuthenticated = true;
      res.locals.accessToken = accessToken;
      next();
    }
  );
};

export default verifyWebAuthToken;
