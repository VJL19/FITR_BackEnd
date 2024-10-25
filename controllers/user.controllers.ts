import { NextFunction, Request, Response } from "express";
import connection from "../config/mysql";
import IUser from "../utils/types/user.types";
import hashPassword from "../utils/helpers/hashPassword";
import compareHashPassword from "../utils/helpers/compareHash";
import {
  register_validator,
  login_validator,
  edit_validator,
  forgot_password_validator,
  change_password_validator,
} from "../utils/validations/auth_validations";
import sendEmail from "../utils/helpers/sendOTP";
import generateToken, {
  generateTokenWeb,
} from "../utils/helpers/generateToken";
import multer from "multer";
import path from "path";
import generateNum from "../utils/helpers/generateCode";
import clients from "../global/socket.global";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/profile_pics");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });

const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    LastName,
    FirstName,
    MiddleName,
    Age,
    ContactNumber,
    Email,
    Height,
    Weight,
    Username,
    Password,
    ConfirmPassword,
    ProfilePic,
    Gender,
    Address,
    Birthday,
    SubscriptionType,
  } = <IUser>req.body;

  const validate_fields = register_validator.validate({
    LastName,
    FirstName,
    MiddleName,
    Age,
    ContactNumber,
    Email,
    Height,
    Weight,
    Username,
    Password,
    ConfirmPassword,
    ProfilePic,
    Gender,
    Address,
    Birthday,
    SubscriptionType,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields?.error?.details[0].message,
      status: 400,
    });
  }
  const encryptedPass = await hashPassword(Password, 10);
  const encryptedConfirmpass = encryptedPass;

  const values = [
    LastName,
    FirstName,
    MiddleName,
    Age,
    Birthday,
    ContactNumber,
    Address,
    Email,
    Height,
    Weight,
    Username,
    encryptedPass,
    encryptedConfirmpass,
    ProfilePic,
    Gender,
    SubscriptionType,
    "not activated",
    null,
    "User",
    null,
  ];
  const query =
    "INSERT INTO tbl_users (`LastName`, `FirstName`, `MiddleName`, `Age`, `Birthday`, `ContactNumber`, `Address`, `Email`, `Height`, `Weight`, `Username`, `Password`, `ConfirmPassword`, `ProfilePic`, `Gender`, `SubscriptionType`, `Activation`, `RFIDNumber`, `Role`, `ExpoNotifToken`) VALUES (?)";

  connection.query(query, [values], (error, result: IUser[]) => {
    if (error)
      return res
        .status(400)
        .json({ message: error.sqlMessage, status: 400, error: error });
    // next();
    return res.json({ message: "Successfully register!", status: 200 });
  });
};

const adminRegisterUserController = async (req: Request, res: Response) => {
  const {
    LastName,
    FirstName,
    MiddleName,
    Age,
    ContactNumber,
    Email,
    Height,
    Weight,
    Username,
    Password,
    ConfirmPassword,
    ProfilePic,
    Gender,
    Address,
    Birthday,
    SubscriptionType,
    RFIDNumber,
  } = <IUser>req.body;

  const validate_fields = register_validator.validate({
    LastName,
    FirstName,
    MiddleName,
    Age,
    ContactNumber,
    Email,
    Height,
    Weight,
    Username,
    Password,
    ConfirmPassword,
    ProfilePic,
    Gender,
    Address,
    Birthday,
    SubscriptionType,
    RFIDNumber,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields?.error?.details[0].message,
      status: 400,
    });
  }
  const encryptedPass = await hashPassword(Password, 10);
  const encryptedConfirmpass = encryptedPass;

  const values = [
    LastName,
    FirstName,
    MiddleName,
    Age,
    Birthday,
    ContactNumber,
    Address,
    Email,
    Height,
    Weight,
    Username,
    encryptedPass,
    encryptedConfirmpass,
    "default_poster.png",
    Gender,
    SubscriptionType,
    "not activated",
    null,
    "User",
    null,
  ];
  const query =
    "INSERT INTO tbl_users (`LastName`, `FirstName`, `MiddleName`, `Age`, `Birthday`, `ContactNumber`, `Address`, `Email`, `Height`, `Weight`, `Username`, `Password`, `ConfirmPassword`, `ProfilePic`, `Gender`, `SubscriptionType`, `Activation`, `RFIDNumber`, `Role`, `ExpoNotifToken`) VALUES (?)";

  connection.query(query, [values], (error, result: IUser[]) => {
    if (error)
      return res.status(400).json({ message: error.sqlMessage, error: error });

    return res.status(200).json({ message: "Successfully register user!" });
  });
};

const updateUserSubscription = async (req: Request, res: Response) => {
  const { UserID, SubscriptionType, RFIDNumber } = <IUser>req.body;

  const queryExpiration =
    "SELECT * FROM tbl_attendance WHERE `UserID` = ? AND Date(SubscriptionExpectedEnd) > NOW()";

  connection.query(queryExpiration, [UserID], (error, result) => {
    if (error)
      return res.status(400).json({ error: error, message: error.sqlMessage });

    if (result.length > 0) {
      return res.status(402).json({
        message:
          "This user has currently active monthly subscription. Action cannot be done",
        status: 402,
      });
    }

    const query =
      "UPDATE tbl_users SET `SubscriptionType` = ?, `RFIDNumber` = ? WHERE `UserID` = ? LIMIT 1;SELECT * FROM tbl_users where UserID = (?) LIMIT 1;";

    connection.query(
      query,
      [SubscriptionType, RFIDNumber, UserID, UserID],
      (error, result) => {
        if (error)
          return res
            .status(400)
            .json({ error: error, message: error.sqlMessage });

        const refreshToken = generateToken(result[1][0]);

        for (var i in clients) {
          clients[i].emit("refresh_user", { refresh_token: refreshToken });
        }
        return res.status(200).json({
          message: "Successfully update the subscription type!",
          status: 200,
          accessToken: refreshToken,
        });
      }
    );
  });
};

const getTotalUserController = async (req: Request, res: Response) => {
  const query = "SELECT COUNT(*) as TotalUser FROM tbl_users;";

  connection.query(query, (err, result) => {
    if (err)
      return res.status(400).json({ error: err, message: err.sqlMessage });

    return res.status(200).json({
      message: "Total users is display successfully!",
      status: 200,
      result: result,
    });
  });
};
const getTotalSessionUserController = async (req: Request, res: Response) => {
  const query =
    "SELECT COUNT(*) as TotalUser FROM tbl_users WHERE SubscriptionType = 'Session';";

  connection.query(query, (err, result) => {
    if (err)
      return res.status(400).json({ error: err, message: err.sqlMessage });

    return res.status(200).json({
      message: "Total session users is display successfully!",
      status: 200,
      result: result,
    });
  });
};
const getTotalMonthlyUserController = async (req: Request, res: Response) => {
  const query =
    "SELECT COUNT(*) as TotalUser FROM tbl_users WHERE SubscriptionType = 'Monthly';";

  connection.query(query, (err, result) => {
    if (err)
      return res.status(400).json({ error: err, message: err.sqlMessage });

    return res.status(200).json({
      message: "Total monthly users is display successfully!",
      status: 200,
      result: result,
    });
  });
};

const loginController = async (req: Request, res: Response) => {
  const { Username, Password } = <IUser>req.body;

  const query = `SELECT * FROM tbl_users where Username = (?) AND Role != 'Admin' LIMIT 1`;

  const validate_login_fields = login_validator.validate({
    Username,
    Password,
  });

  if (validate_login_fields.error) {
    return res.status(400).json({
      status: 400,
      details: validate_login_fields.error.details[0].message,
    });
  }

  connection.query(query, [Username], async (error, result: IUser[]) => {
    if (error) return res.status(400).json({ status: 400, error: error });

    if (result.length != 1) {
      return res.status(400).json({
        details: "Account does not exist!",
        status: 400,
      });
    }
    const comparePassword = await compareHashPassword(
      Password,
      result[0].Password
    );

    if (!comparePassword) {
      return res.status(400).json({
        status: 400,
        details: "Incorrect Password!",
      });
    }

    if (result[0].Role === "Admin") {
      return res.status(400).json({
        status: 400,
        details: "You are not authorized to access this account!",
      });
    }
    if (result[0].Activation === "not activated") {
      return res.status(401).json({
        status: 401,
        details:
          "Your account has not yet activated! Redirecting to activation page!",
        email: result[0].Email,
      });
    }
    const accessToken = generateToken(result[0]);

    return res.status(200).json({
      status: 200,
      details: "Login succesfully!",
      accessToken: accessToken,
      user: result[0],
    });
  });
};

const loginUserWebController = (req: Request, res: Response) => {
  const { Username, Password } = <IUser>req.body;

  const query = "SELECT * FROM tbl_users where Username = (?) LIMIT 1";

  const validate_login_fields = login_validator.validate({
    Username,
    Password,
  });

  if (validate_login_fields.error) {
    return res.status(400).json({
      status: 400,
      details: validate_login_fields.error.details[0].message,
    });
  }

  connection.query(query, [Username], async (error, result: IUser[]) => {
    if (error) return res.status(400).json({ status: 400, error: error });

    if (result.length != 1) {
      return res.status(400).json({
        details: "Account does not exist!",
        status: 400,
      });
    }
    const comparePassword = await compareHashPassword(
      Password,
      result[0].Password
    );

    if (!comparePassword) {
      return res.status(400).json({
        status: 400,
        details: "Incorrect Password!",
      });
    }
    const accessToken = generateTokenWeb(result[0]);
    //set expiry for the cookie.
    let date = new Date();
    let minutes = 30;
    date.setTime(date.getTime() + minutes * 60 * 1000);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      expires: date,
      sameSite: "none",
    });

    return res.status(200).json({
      status: 200,
      details: "Login succesfully!",
      user: result[0],
    });
  });
};

const loginAsGuestController = (req: Request, res: Response) => {
  const result: IUser[] = [
    {
      Role: "User",
      Address: "Guest Address",
      Age: 0,
      Birthday: "Guest BirthDay",
      Password:
        "070c01287d7cbaa652d2bba69ec601f4fc54c7428b3251f563a475ec67b541d3c3a5dd35d51955de43c7a6f5d41b47758adc16f9003894baed04684dd2bd8bea",
      ConfirmPassword:
        "070c01287d7cbaa652d2bba69ec601f4fc54c7428b3251f563a475ec67b541d3c3a5dd35d51955de43c7a6f5d41b47758adc16f9003894baed04684dd2bd8bea",
      ContactNumber: "9999999999",
      Email: "guest@mail.com",
      FirstName: "Guest firstname",
      Gender: "Male",
      Height: 180,
      Weight: 90,
      GuestLogin: true,
      LastName: "Guest lastname",
      MiddleName: "Guest middlename",
      ProfilePic: "default_poster.png",
      SubscriptionType: "Session",
      UserID: 0,
      Username: "guest123",
    },
  ];
  const accessToken = generateTokenWeb(result[0]);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    maxAge: 60000,
    sameSite: "none",
  });

  return res.status(200).json({
    status: 200,
    details: "Login as guest succesfully!",
    user: result[0],
  });
};

const logoutUserWebController = (req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    maxAge: 60000,
    sameSite: "none",
  });

  return res.status(200).json({ message: "Logout successfully!", status: 200 });
};

const logoutController = (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  req.headers["authorization"] = "";

  return res
    .status(200)
    .json({ message: "Account Logout Successfully!", status: 200 });
};

const editUserController = async (req: Request, res: Response) => {
  const {
    LastName,
    FirstName,
    MiddleName,
    Gender,
    Weight,
    Height,
    UserID,
    ProfilePic,
    Username,
    Email,
    ContactNumber,
    Password,
    ConfirmPassword,
    Address,
    Birthday,
    Age,
    SubscriptionType,
  } = <IUser>req.body;

  const validate_fields = edit_validator.validate({
    UserID,
    ProfilePic,
    Username,
    Email,
    ContactNumber,
    Password,
    ConfirmPassword,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      status: 400,
      error: validate_fields.error.details[0].message,
    });
  }
  const values = [
    ProfilePic,
    Username,
    Email,
    ContactNumber,
    Password,
    ConfirmPassword,
    UserID,
  ];

  //check if the credentials entered is already exist!

  const query = `UPDATE tbl_users SET ProfilePic = ?, Username = ?, Email = ?, ContactNumber = ?, Password = ?,ConfirmPassword = ? WHERE UserID = ? LIMIT 1`;

  const encryptedPass = await hashPassword(Password, 10);
  const encryptedConfirmpass = encryptedPass;
  connection.query(
    query,
    [
      ProfilePic,
      Username,
      Email,
      ContactNumber,
      encryptedPass,
      encryptedConfirmpass,
      UserID,
    ],
    (error, result) => {
      if (error) {
        console.log(error);
        return res.status(400).json({ status: 400, error: error });
      }

      const accessToken = generateToken({
        UserID: UserID,
        LastName: LastName,
        FirstName: FirstName,
        MiddleName: MiddleName,
        Username: Username,
        Email: Email,
        ContactNumber: ContactNumber,
        Height: Height,
        Weight: Weight,
        ProfilePic: ProfilePic,
        Gender: Gender,
        Address: Address,
        Age: Age,
        Birthday: Birthday,
        SubscriptionType: SubscriptionType,
        Password: Password,
        ConfirmPassword: ConfirmPassword,
      });

      for (var i in clients) {
        clients[i].emit("refresh_user");
      }

      return res.status(200).json({
        message: "Change account! successfully!",
        result: result,
        status: 200,
        accessToken: accessToken,
      });
    }
  );
};

const forgotPasswordController = (req: Request, res: Response) => {
  const { Email } = <IUser>req.body;

  const validate_forgot_password = forgot_password_validator.validate({
    Email,
  });

  if (validate_forgot_password.error) {
    return res.status(400).json({
      error: validate_forgot_password.error.details[0].message,
      status: 400,
    });
  }

  const query = "SELECT * from tbl_users WHERE `Email` = ?";

  connection.query(query, [Email], async (error, result: IUser[]) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    if (result.length != 1) {
      return res
        .status(400)
        .json({ message: "Type email does not exist!", status: 400 });
    }

    const generatedCode = generateNum();
    try {
      const emailRes = await sendEmail({
        forgotPassword: true,
        email: result[0].Email,
        code: generatedCode,
        subject: "REQUEST FOR FORGOT PASSWORD",
        emailTitle: "OTP VERIFICATION CODE",
        emailDescription:
          "Enter the generate OTP below to complete the process of your forgot password. Note: If you do not request this code, you may disregard this email notification.",
      });

      return res.status(200).json({
        emailResult: emailRes,
        code: generatedCode,
        status: 200,
        result: result,
        message:
          "OTP code is successfully sent to your email! Please check your inbox or spam",
      });
    } catch (err) {
      return res.status(400).json({ message: "An error is occuredd!" });
    }
  });
};

const changePasswordController = async (req: Request, res: Response) => {
  const { Email, Password, ConfirmPassword } = req.body;

  const validate_change_password_fields = change_password_validator.validate({
    Email,
    Password,
    ConfirmPassword,
  });

  const encrpytPass = await hashPassword(Password, 10);
  const encryptConfirmPass = encrpytPass;
  if (validate_change_password_fields.error) {
    return res.status(400).json({
      error: validate_change_password_fields.error.details[0].message,
      status: 400,
    });
  }

  const query =
    "UPDATE tbl_users SET `Password` = ?, `ConfirmPassword` = ? WHERE `Email` = ? LIMIT 1;";

  connection.query(
    query,
    [encrpytPass, encryptConfirmPass, Email],
    (error, result) => {
      if (error) return res.status(400).json({ error: error, status: 400 });

      return res.status(200).json({
        message: "Change password successfully!",
        status: 200,
        result: result,
      });
    }
  );
};

const sendEmailController = async (req: Request, res: Response) => {
  const { Email } = <IUser>req.body;

  const generatedCode = generateNum();
  try {
    const emailRes = await sendEmail({
      email: Email,
      code: generatedCode,
      subject: "REGISTRATION COMPLETION",
      emailTitle: "OTP VERIFICATION CODE",
      emailDescription:
        "Enter the generate OTP below to complete your registration in our FITR application. Note: Please don't distribute this code from anyone.",
    });

    return res.status(200).json({ result: emailRes, code: generatedCode });
  } catch (err) {
    return res
      .status(400)
      .json({ message: "An error is occured!", error: err });
  }
};

const getUsersController = (req: Request, res: Response) => {
  const query = "SELECT * FROM tbl_users ORDER BY `UserID` DESC;";

  connection.query(query, (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      messsage: "All users is displayed successfully!",
      status: 200,
      result: result,
    });
  });
};

const setUserActivationController = (req: Request, res: Response) => {
  const { Email } = <IUser>req.body;
  const query =
    "UPDATE tbl_users SET `Activation` = 'activated' WHERE `Email` = ? LIMIT 1;SELECT * FROM tbl_users WHERE `Email` = ? LIMIT 1;";
  connection.query(query, [Email, Email], (error, result: IUser[]) => {
    if (error)
      return res.status(400).json({ error: error, message: error.sqlMessage });

    return res.status(200).json({
      message: "Successfully activated this account!",
      result: result,
      email: result[1]?.Email,
    });
  });
};

const deleteUserController = (req: Request, res: Response) => {
  const UserID = req.params.UserID.split(":")[1];
  const query = "DELETE FROM tbl_users WHERE `UserID` = ? LIMIT 1;";
  connection.query(query, [UserID], (error, result: IUser[]) => {
    if (error)
      return res.status(400).json({ error: error, message: error.sqlMessage });

    return res.status(200).json({
      message: "Successfully deleted this account!",
      result: result[0],
    });
  });
};

const addExpoTokenUserController = (req: Request, res: Response) => {
  const { ExpoNotifToken, Email } = req.body;

  const query =
    "UPDATE tbl_users SET `ExpoNotifToken` = ? WHERE `Email` = ? LIMIT 1;";

  connection.query(query, [ExpoNotifToken, Email], (error, result) => {
    if (error)
      return res
        .status(400)
        .json({ error: error, message: error.sqlMessage, status: 400 });

    return res.status(200).json({
      message: "Successfully inserted an expo notif token from this user!",
      status: 200,
      result: result,
    });
  });
};

export {
  changePasswordController,
  forgotPasswordController,
  addExpoTokenUserController,
  loginController,
  loginUserWebController,
  logoutUserWebController,
  loginAsGuestController,
  registerController,
  logoutController,
  editUserController,
  sendEmailController,
  getUsersController,
  getTotalUserController,
  getTotalSessionUserController,
  getTotalMonthlyUserController,
  adminRegisterUserController,
  updateUserSubscription,
  setUserActivationController,
  deleteUserController,
  upload,
};
