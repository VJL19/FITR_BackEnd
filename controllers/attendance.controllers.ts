import { Request, Response } from "express";
import crypto from "crypto";
import IAttendance from "../utils/types/attendance.types";
import connection from "../config/mysql";
import {
  attendance_validator,
  create_userRecord_validator,
  edit_userRecord_validator,
  delete_userRecord_validator,
} from "../utils/validations/attendance.validations";
import IUser from "../utils/types/user.types";
import { formatTime } from "../utils/helpers/formatTime";

const checkUserTapRFID = (req: Request, res: Response) => {
  const UserID = req.params.UserID.split(":")[1];

  const query = "SELECT * FROM tbl_attendance WHERE `UserID` = ? LIMIT 1;";
  connection.query(query, [UserID], (err, result: IAttendance[]) => {
    if (err) return res.status(400).json({ error: err, status: 400 });

    if (result.length != 1) {
      return res.status(400).json({
        message:
          "You have not tapped yet! Please proceed to tap your RFID card now!",
        status: 400,
        IsTapRFID: "false",
        user: result[0],
      });
    }
    return res.status(200).json({
      message: "Successfully retrieve one user",
      status: 200,
      user: result[0],
    });
  });
};

const checkUserRFIDExist = (req: Request, res: Response) => {
  const RFIDNum = req.params.RFIDNumber.split(":")[1];

  const query = "SELECT * FROM tbl_users WHERE `RFIDNumber` = ? LIMIT 1;";

  connection.query(query, [RFIDNum], (err, result: IUser[]) => {
    if (err) return res.status(400).json({ error: err, status: 400 });

    if (result.length != 1) {
      return res.status(401).json({
        message:
          "This RFID number is not found. You may register first for the user",
        status: 401,
      });
    }

    if (result[0].IsRFIDActive === "Not Active") {
      return res.status(400).json({
        status: 401,
        message:
          "This RFID Status is not active! Please contact gym owner to change for this RFID status!",
      });
    }

    return res.status(200).json({
      message: "This user has RFID number",
      user: result[0],
      status: 200,
    });
  });
};

const generateSecretCodeController = (req: Request, res: Response) => {
  const randomBytes = crypto.randomBytes(16).toString("hex");
  const secretCode = `${new Date().toLocaleDateString()} ${randomBytes}`;

  return res.status(200).json({
    IsScanQR: res.locals.payload.IsScanQR,
    message: "Successfully generate a secret data on QR code.",
    secretCode: `${new Date()
      .toLocaleString()
      .slice(0, 10)} MJESHTER SECRET CODE`,
    status: 200,
  });
};

//if the user has no a mobile phone.

const createUserRecordController = (req: Request, res: Response) => {
  const {
    ProfilePic,
    LastName,
    FirstName,
    SubscriptionType,
    DateTapped,
    SubscriptionExpectedEnd,
    IsPaid,
  } = <IAttendance>req.body;

  const validate_create_fields = create_userRecord_validator.validate({
    ProfilePic,
    LastName,
    FirstName,
    SubscriptionType,
    DateTapped,
    SubscriptionExpectedEnd,
    IsPaid,
  });

  if (validate_create_fields.error) {
    return res.status(400).json({
      error: validate_create_fields.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "INSERT INTO tbl_attendance (`ProfilePic`, `LastName`, `FirstName`, `SubscriptionType`, `DateTapped`, `SubscriptionExpectedEnd`, `IsPaid`) VALUES (?) LIMIT 1;";

  const values = [
    ProfilePic,
    LastName,
    FirstName,
    SubscriptionType,
    DateTapped,
    SubscriptionExpectedEnd,
    IsPaid,
  ];

  connection.query(query, [values], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "New user record is successfully added!",
      status: 200,
      result: result,
    });
  });
};

const editUserRecordController = (req: Request, res: Response) => {
  const {
    AttendanceID,
    ProfilePic,
    LastName,
    FirstName,
    SubscriptionType,
    DateTapped,
    SubscriptionExpectedEnd,
    IsPaid,
  } = <IAttendance>req.body;

  const validate_edit_fields = edit_userRecord_validator.validate({
    AttendanceID,
    ProfilePic,
    LastName,
    FirstName,
    SubscriptionType,
    DateTapped,
    SubscriptionExpectedEnd,
    IsPaid,
  });

  if (validate_edit_fields.error) {
    return res.status(400).json({
      error: validate_edit_fields.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "UPDATE tbl_attendance SET `ProfilePic` = ?, `LastName` = ?, `FirstName` = ?, `SubscriptionType` = ?, `DateTapped` = ?, `SubscriptionExpectedEnd` = ?,`IsPaid` = ? WHERE `AttendanceID` = ? LIMIT 1;";

  connection.query(
    query,
    [
      ProfilePic,
      LastName,
      FirstName,
      SubscriptionType,
      DateTapped,
      SubscriptionExpectedEnd,
      IsPaid,
      AttendanceID,
    ],
    (error, result) => {
      if (error) return res.status(400).json({ error: error, status: 400 });

      return res.status(200).json({
        message: "User record is edited successfully!",
        status: 200,
        result: result,
      });
    }
  );
};

const deleteUserRecordController = (req: Request, res: Response) => {
  const AttendanceID = req.params.AttendanceID;

  const validate_delete_fields = delete_userRecord_validator.validate({
    AttendanceID,
  });

  if (validate_delete_fields.error) {
    return res.status(400).json({
      error: validate_delete_fields.error.details[0].message,
      status: 400,
    });
  }
  const query = "DELETE FROM tbl_attendance WHERE `AttendanceID` = ? LIMIT 1;";

  connection.query(query, [AttendanceID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "User record is deleted successfully!",
      status: 200,
      result: result,
    });
  });
};
//if the user has a mobile phone.
const tapRFIDCardController = (req: Request, res: Response) => {
  const {
    UserID,
    ProfilePic,
    LastName,
    FirstName,
    SubscriptionType,
    DateTapped,
    SubscriptionExpectedEnd,
    IsPaid,
    TimeIn,
    TimeOut,
  } = <IAttendance>req.body;

  const checkToTimeout =
    "SELECT * FROM tbl_attendance WHERE `UserID` = ? AND `TimeOut` = 'NULL' ORDER BY `UserID` DESC LIMIT 1;";

  connection.query(checkToTimeout, [UserID], (error, result: IAttendance[]) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    if (result.length != 1) {
      const validate_attendance_fields = attendance_validator.validate({
        UserID,
        ProfilePic,
        LastName,
        FirstName,
        SubscriptionType,
        DateTapped,
        SubscriptionExpectedEnd,
        IsPaid,
        TimeIn,
        TimeOut,
      });

      if (validate_attendance_fields.error) {
        return res.status(400).json({
          error: validate_attendance_fields.error.details[0].message,
          status: 400,
        });
      }
      const query =
        "INSERT INTO tbl_attendance (`UserID`, `ProfilePic`, `LastName`, `FirstName`, `SubscriptionType`, `TimeIn`, `TimeOut`, `DateTapped`, `SubscriptionExpectedEnd`,`IsPaid`) VALUES (?) LIMIT 1;";
      const values = [
        UserID,
        ProfilePic,
        LastName,
        FirstName,
        SubscriptionType,
        TimeIn,
        TimeOut,
        DateTapped,
        SubscriptionExpectedEnd,
        IsPaid,
      ];
      connection.query(query, [values], (error, result) => {
        if (error) return res.status(400).json({ error: error, status: 400 });

        return res.status(200).json({
          message: "is successfully recorded to attendance!",
          status: 200,
          result: result,
        });
      });
      return;
    }
    if (result.length === 1) {
      const updateTimeOut = `UPDATE tbl_attendance SET TimeOut = '${formatTime(
        new Date()
      )}' WHERE UserID = ? ORDER BY AttendanceID DESC LIMIT 1;`;

      connection.query(updateTimeOut, [UserID], (error, result) => {
        if (error) return res.status(400).json({ error: error, status: 400 });

        return res.status(200).json({
          message: "has time out successfully!",
          status: 200,
          result: result,
        });
      });
      return;
    }
  });
};

const updateIsPaidRecordsController = (req: Request, res: Response) => {
  const { UserID } = <IUser>req.body;
  const query =
    "UPDATE tbl_attendance SET `IsPaid` = 'true' WHERE `UserID` = ? LIMIT 1; ";

  connection.query(query, [UserID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Update isPaid field successfully!",
      result: result,
      status: 200,
    });
  });
};

const getUserSpecificRecord = (req: Request, res: Response) => {
  const UserID = req.params.UserID.split(":")[1];

  const query = "SELECT * FROM tbl_attendance WHERE `UserID` = ?;";

  connection.query(query, [UserID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "User record get succesfully!",
      result: result,
      status: 200,
    });
  });
};

const getUserAttendanceHistory = (req: Request, res: Response) => {
  const UserID = req.params.UserID.split(":")[1];

  const query =
    "SELECT * FROM tbl_attendance WHERE `UserID` = ? ORDER BY `DateTapped` DESC;";

  connection.query(query, [UserID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "User record get succesfully!",
      result: result,
      status: 200,
    });
  });
};

const getUserAttendanceHistoryByDate = (req: Request, res: Response) => {
  const { UserID, selectedDate } = req.body;

  const query =
    "SELECT * FROM tbl_attendance WHERE `UserID` = ? AND Date(`DateTapped`) = Date(?) ORDER BY `DateTapped` DESC;";

  connection.query(query, [UserID, selectedDate], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "User attendance by date is get successfully!",
      result: result,
      status: 200,
    });
  });
};

const getUserRFIDNumber = (req: Request, res: Response) => {
  const UserID = req.params.UserID.split(":")[1];

  const query = "SELECT RFIDNumber FROM tbl_users WHERE `UserID` = ? LIMIT 1;";

  connection.query(query, [UserID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Successfully get the RFID Number for this user!",
      result: result,
      status: 200,
    });
  });
};
const getAllUserAttendance = (req: Request, res: Response) => {
  const query =
    "SELECT * FROM tbl_attendance WHERE DATE(SUBSTRING(tbl_attendance.DateTapped, 1, 11)) = DATE(NOW()) ORDER BY tbl_attendance.DateTapped DESC;";
  connection.query(query, (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All user attendance get succesfully!",
      result: result,
      status: 200,
    });
  });
};
const getAllUserAttendanceHistory = (req: Request, res: Response) => {
  const query =
    "SELECT * FROM tbl_attendance ORDER BY tbl_attendance.DateTapped DESC;";
  connection.query(query, (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All user attendance history get succesfully!",
      result: result,
      status: 200,
    });
  });
};
const getAllRecentAttendance = (req: Request, res: Response) => {
  const query =
    "SELECT * FROM tbl_attendance ORDER BY tbl_attendance.DateTapped DESC LIMIT 5;";
  connection.query(query, (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All user recent attendance get succesfully!",
      result: result,
      status: 200,
    });
  });
};

export {
  createUserRecordController,
  editUserRecordController,
  deleteUserRecordController,
  generateSecretCodeController,
  tapRFIDCardController,
  updateIsPaidRecordsController,
  checkUserTapRFID,
  checkUserRFIDExist,
  getUserSpecificRecord,
  getUserAttendanceHistory,
  getAllUserAttendance,
  getAllUserAttendanceHistory,
  getAllRecentAttendance,
  getUserRFIDNumber,
  getUserAttendanceHistoryByDate,
};
