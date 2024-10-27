import jwt, { Secret } from "jsonwebtoken";
import loadConfig from "../types/config.types";

interface IUserPayload {
  UserID: number;
  LastName: string;
  FirstName: string;
  MiddleName: string;
  Username: string;
  Age?: number;
  Address?: string;
  SubscriptionType: string;
  Birthday?: string;
  Email: string;
  ContactNumber?: string;
  Height?: number;
  Weight?: number;
  ProfilePic?: string;
  Gender?: string;
  Activation?: string;
  Password?: string;
  ConfirmPassword?: string;
  RFIDNumber?: string;
  Role?: string;
  GuestLogin?: boolean;
}

const generateToken = (user: IUserPayload) => {
  const config = loadConfig();
  const user_payload: IUserPayload = {
    UserID: user.UserID,
    LastName: user.LastName,
    FirstName: user.FirstName,
    MiddleName: user.MiddleName,
    Username: user.Username,
    Age: user.Age,
    Address: user.Address,
    Birthday: user.Birthday,
    ContactNumber: user.ContactNumber,
    Height: user.Height,
    Weight: user.Weight,
    ProfilePic: user.ProfilePic,
    Gender: user.Gender,
    Email: user.Email,
    SubscriptionType: user.SubscriptionType,
    Activation: user.Activation,
    RFIDNumber: user.RFIDNumber,
    Role: user.Role,
  };
  const accessToken = jwt.sign(
    user_payload,
    config.ACCESS_TOKEN_SECRET as Secret,
    {
      expiresIn: "20m",
    }
  );

  return accessToken;
};
export const generateTokenWeb = (user: IUserPayload) => {
  const config = loadConfig();
  const user_payload: IUserPayload = {
    UserID: user.UserID,
    LastName: user.LastName,
    FirstName: user.FirstName,
    MiddleName: user.MiddleName,
    Username: user.Username,
    Email: user.Email,
    GuestLogin: user.GuestLogin,
    SubscriptionType: user.SubscriptionType,
    Activation: user.Activation,
    ProfilePic: user.ProfilePic,
    ContactNumber: user.ContactNumber,
    RFIDNumber: user.RFIDNumber,
    Role: user.Role,
  };
  const accessToken = jwt.sign(
    user_payload,
    config.ACCESS_TOKEN_SECRET as Secret,
    {
      expiresIn: "20m",
    }
  );

  return accessToken;
};

export default generateToken;
