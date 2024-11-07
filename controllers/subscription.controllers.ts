import { Request, Response } from "express";
import ISubscriptions from "../utils/types/subscription.types";
import connection from "../config/mysql";
import {
  scan_subscription_validator,
  create_subscription_validator,
  fulfill_subscription_validator,
  edit_subcription_validator,
  delete_subscription_validator,
  admin_createSubscription_validator,
} from "../utils/validations/subscription.validations";
import clients from "../global/socket.global";
import IUser from "../utils/types/user.types";
import Expo from "expo-server-sdk";
import { sendPushNotification } from "../utils/helpers/ExpoSdk";

//if the user has a mobile phone.
const createSubscriptionController = (req: Request, res: Response) => {
  const {
    UserID,
    SubscriptionAmount,
    SubscriptionBy,
    SubscriptionType,
    SubscriptionStatus,
    SubscriptionMethod,
    SubscriptionEntryDate,
  } = <ISubscriptions>req.body;

  const validate_fields = scan_subscription_validator.validate({
    UserID,
    SubscriptionAmount,
    SubscriptionBy,
    SubscriptionType,
    SubscriptionStatus,
    SubscriptionMethod,
    SubscriptionEntryDate,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }

  const query =
    "INSERT INTO tbl_subscriptions (`UserID`, `SubscriptionAmount`, `SubscriptionBy`, `SubscriptionType`, `SubscriptionMethod`, `SubscriptionStatus`, `SubscriptionEntryDate`) VALUES (?, ?, ?, ?, ?, ?, ?) LIMIT 1;SELECT * FROM tbl_users WHERE `UserID` = ? LIMIT 1;";

  connection.query(
    query,
    [
      UserID,
      SubscriptionAmount,
      SubscriptionBy,
      SubscriptionType,
      SubscriptionMethod,
      SubscriptionStatus,
      SubscriptionEntryDate,
      UserID,
    ],
    async (error, result: IUser[][]) => {
      if (error) return res.status(400).json({ error: error, status: 400 });

      for (let i in clients) {
        clients[i].emit("refresh_transaction");
      }

      if (SubscriptionStatus === "Fulfill") {
        if (Expo.isExpoPushToken(result[1][0].ExpoNotifToken))
          await sendPushNotification(
            result[1][0].ExpoNotifToken,
            `This notification serves that your payment for ${SubscriptionType} subscription has been verified by Paymongo Service :)`,
            "FITR Success Payment Notification"
          );
      }
      if (SubscriptionStatus === "pending") {
        if (Expo.isExpoPushToken(result[1][0].ExpoNotifToken))
          await sendPushNotification(
            result[1][0].ExpoNotifToken,
            `This notification serves that your payment for ${SubscriptionType} subscription will be approved by the gym owner :)`,
            "FITR Pending Payment Notification"
          );
      }

      if (SubscriptionStatus === "reject") {
        if (Expo.isExpoPushToken(result[1][0].ExpoNotifToken))
          await sendPushNotification(
            result[1][0].ExpoNotifToken,
            `This notification serves that your payment for ${SubscriptionType} subscription is rejected by the gym owner :(`,
            "FITR Reject Payment Notification"
          );
      }

      return res.status(200).json({
        message: "Subscription created successfully!",
        result: result,
        status: 200,
      });
    }
  );
};

const adminCreateSubscriptionController = (req: Request, res: Response) => {
  const {
    SubscriptionAmount,
    SubscriptionBy,
    SubscriptionType,
    SubscriptionMethod,
  } = <ISubscriptions>req.body;

  const validate_fields = admin_createSubscription_validator.validate({
    SubscriptionAmount,
    SubscriptionBy,
    SubscriptionType,
    SubscriptionMethod,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "INSERT INTO tbl_subscriptions (`UserID`, `SubscriptionAmount`, `SubscriptionBy`, `SubscriptionType`, `SubscriptionMethod`, `SubscriptionStatus`, `SubscriptionEntryDate`) VALUES(NULL, ?, ?, ?, ?, 'Fulfill', CURRENT_TIMESTAMP());";

  connection.query(
    query,
    [SubscriptionAmount, SubscriptionBy, SubscriptionType, SubscriptionMethod],
    (error, result) => {
      if (error) return res.status(400).json({ error: error, status: 400 });

      for (var i in clients) {
        clients[i].emit("refresh_subscriptionPage");
      }
      return res.status(200).json({
        message: "Subscription created successfully!",
        result: result,
        status: 200,
      });
    }
  );
};
const fulfillSubscriptionController = (req: Request, res: Response) => {
  const { SubscriptionStatus, SubscriptionID } = <ISubscriptions>req.body;

  const validate_fields = fulfill_subscription_validator.validate({
    SubscriptionStatus,
    SubscriptionID,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "UPDATE tbl_subscriptions SET `SubscriptionStatus` = ? WHERE `SubscriptionID` = ? LIMIT 1; SELECT * from tbl_subscriptions WHERE `SubscriptionID` = ? LIMIT 1;";

  connection.query(
    query,
    [SubscriptionStatus, SubscriptionID, SubscriptionID],
    (error, results: IUser[][]) => {
      if (error) return res.status(400).json({ error: error, status: 400 });

      for (var i in clients) {
        clients[i].emit("refresh_subscriptionPage");
      }

      const queryNotif = "SELECT * FROM tbl_users WHERE `UserID` = ? LIMIT 1;";

      connection.query(
        queryNotif,
        [results[1][0].UserID],
        async (error, result: IUser[]) => {
          if (error) return res.status(400).json({ error: error, status: 400 });

          if (Expo.isExpoPushToken(result[0].ExpoNotifToken))
            await sendPushNotification(
              result[0].ExpoNotifToken,
              `This notification serves that your payment for ${results[1][0].SubscriptionType} subscription is already approved by the gym owner :)`,
              "FITR Fulfill Payment Notification"
            );
        }
      );

      return res.status(200).json({
        message: "Subscription fulfill successfully!",
        result: results,
        status: 200,
      });
    }
  );
};

const getAllSubscriptionsByDateController = (req: Request, res: Response) => {
  const { startDate, endDate } = req.body;

  const query =
    "SELECT s.UserID, s.SubscriptionID, s.SubscriptionBy, u.LastName, u.FirstName, u.MiddleName, s.SubscriptionAmount, s.SubscriptionType, s.SubscriptionStatus, s.SubscriptionEntryDate FROM tbl_subscriptions s LEFT JOIN tbl_users u ON s.UserID = u.UserID WHERE DATE(s.SubscriptionEntryDate) BETWEEN Date(?) AND Date(?) AND s.SubscriptionStatus = 'Fulfill' ORDER BY s.SubscriptionEntryDate ASC;";

  connection.query(query, [startDate, endDate], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All subscription today is get successfully!",
      status: 200,
      result: result,
    });
  });
};

//if the user paid without mobile phone and CASH ONLY, the admin could create a new subscription field.

const insertSubscriptionController = (req: Request, res: Response) => {
  const {
    LastName,
    FirstName,
    SubscriptionAmount,
    SubscriptionType,
    SubscriptionEntryDate,
  } = <ISubscriptions>req.body;

  const validate_fields = create_subscription_validator.validate({
    LastName,
    FirstName,
    SubscriptionAmount,
    SubscriptionType,
    SubscriptionEntryDate,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }

  const query =
    "INSERT INTO tbl_subscriptions_no_mphone (`LastName`, `FirstName`, `SubscriptionAmount`,`SubscriptionType`) VALUES (?,?,?, 'CASH', ?) LIMIT 1;";

  connection.query(
    query,
    [
      LastName,
      FirstName,
      SubscriptionAmount,
      SubscriptionType,
      SubscriptionEntryDate,
    ],
    (error, result) => {
      if (error) return res.status(400).json({ error: error, status: 400 });

      return res.status(200).json({
        message: "Subscription inserted successfully!",
        result: result,
        status: 200,
      });
    }
  );
};

const editSubscriptionController = (req: Request, res: Response) => {
  const {
    SubscriptionID,
    LastName,
    FirstName,
    SubscriptionAmount,
    SubscriptionType,
  } = <ISubscriptions>req.body;

  const validate_fields = edit_subcription_validator.validate({
    SubscriptionID,
    LastName,
    FirstName,
    SubscriptionAmount,
    SubscriptionType,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }

  const query =
    "UPDATE tbl_subscriptions_no_mphone `LastName` = ?, `FirstName` = ?, `SubscriptionAmount` = ?,`SubscriptionType` = ? WHERE `SubscriptionID` = ? LIMIT 1;";

  connection.query(
    query,
    [LastName, FirstName, SubscriptionAmount, SubscriptionType, SubscriptionID],
    (error, result) => {
      if (error) return res.status(400).json({ error: error, status: 400 });

      return res.status(200).json({
        message: "Subscription edited successfully!",
        result: result,
        status: 200,
      });
    }
  );
};

const deleteSubscriptionController = (req: Request, res: Response) => {
  const SubscriptionID = req.params.SubscriptionID.split(":")[1];

  const validate_fields = delete_subscription_validator.validate({
    SubscriptionID,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "DELETE FROM tbl_subscriptions WHERE `SubscriptionID` = ? LIMIT 1;";

  connection.query(query, [SubscriptionID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    for (var i in clients) {
      clients[i].emit("refresh_subscriptionPage");
    }

    return res.status(200).json({
      message: "This subscription is deleted successfully!",
      result: result,
      status: 200,
    });
  });
};

const getAllSubscriptionsAdminController = (req: Request, res: Response) => {
  const query = "SELECT * FROM tbl_subscriptions_no_mphone";

  connection.query(query, (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message:
        "All subscriptions from user paid no mobile is successfully display!",
      status: 200,
      result: result,
    });
  });
};

const getAllSubscriptionsUserController = (req: Request, res: Response) => {
  const query =
    "SELECT s.UserID, s.SubscriptionID, u.Email, u.ContactNumber, u.ProfilePic, s.SubscriptionBy, s.SubscriptionAmount, s.SubscriptionType, s.SubscriptionMethod, s.SubscriptionStatus, s.SubscriptionEntryDate FROM tbl_subscriptions s LEFT JOIN tbl_users u ON s.UserID = u.UserID WHERE DATE(SUBSTRING(s.SubscriptionEntryDate, 1, 11)) = DATE(NOW()) ORDER BY s.SubscriptionID DESC;";

  connection.query(query, (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message:
        "All subscriptions from user paid using mobile is successfully display!",
      status: 200,
      result: result,
    });
  });
};
const getAllSubscriptionsTotalTodayController = (
  req: Request,
  res: Response
) => {
  const query =
    "SELECT COUNT(*) as TotalTodayTransactions FROM tbl_subscriptions s LEFT JOIN tbl_users u ON s.UserID = u.UserID WHERE DATE(SUBSTRING(s.SubscriptionEntryDate, 1, 11)) = DATE(NOW()) ORDER BY s.SubscriptionEntryDate DESC;";

  connection.query(query, (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message:
        "All total subscriptions today from user paid using mobile is successfully display!",
      status: 200,
      result: result,
    });
  });
};

const getAllSubscriptionsUserHistoryController = (
  req: Request,
  res: Response
) => {
  const query =
    "SELECT s.UserID, s.SubscriptionID, u.Email, u.ContactNumber, u.ProfilePic, s.SubscriptionBy, s.SubscriptionAmount, s.SubscriptionType, s.SubscriptionMethod, s.SubscriptionStatus, s.SubscriptionEntryDate FROM tbl_subscriptions s LEFT JOIN tbl_users u ON s.UserID = u.UserID ORDER BY s.SubscriptionID DESC;";

  connection.query(query, (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message:
        "All subscriptions from user paid using mobile is successfully display!",
      status: 200,
      result: result,
    });
  });
};

const getSpecificSubscriptionUserController = (req: Request, res: Response) => {
  const UserID = req.params.UserID.split(":")[1];
  const query =
    "SELECT *, u.Email, u.ContactNumber FROM tbl_subscriptions tbl_s LEFT JOIN tbl_users u ON tbl_s.UserID = u.UserID WHERE u.`UserID` = ? AND tbl_s.`SubscriptionStatus` = 'pending' LIMIT 1;";
  connection.query(query, [UserID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message:
        "All specific subscriptions from user paid using mobile is successfully display!",
      status: 200,
      result: result,
    });
  });
};
const getUserSessionSubscriptionAlreadyPaidController = (
  req: Request,
  res: Response
) => {
  const UserID = req.params.UserID.split(":")[1];
  const query =
    "SELECT * FROM tbl_subscriptions WHERE UserID = ? AND SUBSTRING(SubscriptionEntryDate, 1, 11) = DATE(now()) AND SubscriptionType = 'Session' LIMIT 1;SELECT * FROM tbl_attendance WHERE UserID = ? AND TimeOut != 'NULL' AND DATE(SUBSTRING(DateTapped, 1, 11)) = DATE(NOW()) AND SubscriptionType = 'Session' LIMIT 1;";

  connection.query(query, [UserID, UserID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    if (result[0].length == 0) {
      return res.status(401).json({
        message: "User session has a due payment!",
        status: 401,
        result: result,
      });
    }
    return res
      .status(200)
      .json({ message: "User session is already paid!", status: 200 });

    // if (result[1].length > 0) {
    //   return res.status(200).json({
    //     message: "User session has a due payment!",
    //     status: 200,
    //     result: result,
    //   });
    // }

    // return res.status(200).json({
    //   message: "User session has a due payment!",
    //   status: 200,
    //   result: result,
    // });
  });
};
const getUserMonthlySubscriptionAlreadyPaidController = (
  req: Request,
  res: Response
) => {
  const UserID = req.params.UserID.split(":")[1];
  const query =
    "SELECT *, DATE(DATE_ADD(SubscriptionEntryDate, INTERVAL + 30 DAY)) AS SubscriptionExpectedEnd FROM tbl_subscriptions WHERE UserID = ? AND DATE(DATE_ADD(SubscriptionEntryDate, INTERVAL + 30 DAY)) >= DATE(NOW()) AND SubscriptionType = 'Monthly' LIMIT 1;";
  connection.query(query, [UserID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    if (result.length == 0) {
      return res.status(401).json({
        message: "User monthly has a due payment!",
        status: 401,
      });
    }

    return res.status(200).json({
      message: "User monthly is already paid!",
      status: 200,
      result: result,
    });
  });
};
const getSubscriptionHistoryController = (req: Request, res: Response) => {
  const UserID = req.params.UserID.split(":")[1];
  const query =
    "SELECT * FROM tbl_subscriptions WHERE `UserID` = ? AND `SubscriptionStatus` != 'Pending' ORDER BY SubscriptionEntryDate DESC;";

  connection.query(query, [UserID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message:
        "All subscriptions history from user paid using mobile is successfully display!",
      status: 200,
      result: result,
    });
  });
};

const getSubscriptionHistoryByDateController = (
  req: Request,
  res: Response
) => {
  const { UserID, selectedDate } = req.body;

  const query =
    "SELECT * FROM tbl_subscriptions s LEFT JOIN tbl_users u on s.UserID = u.UserID WHERE s.`UserID` = ? AND s.`SubscriptionStatus` != 'Pending' AND DATE(s.SubscriptionEntryDate) = DATE(?) ORDER BY s.SubscriptionEntryDate DESC";
  connection.query(query, [UserID, selectedDate], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message:
        "All subscriptions history from user paaid using mobile by date is successfully display!",
      status: 200,
      result: result,
    });
  });
};

const getAllRecentSubscriptionsController = (req: Request, res: Response) => {
  const query =
    "SELECT s.UserID,  s.SubscriptionID, u.ProfilePic, u.LastName, u.FirstName, u.MiddleName, s.SubscriptionBy, s.SubscriptionAmount, s.SubscriptionType, s.SubscriptionStatus, s.SubscriptionEntryDate FROM tbl_subscriptions s LEFT JOIN tbl_users u ON s.UserID = u.UserID ORDER BY s.SubscriptionEntryDate DESC LIMIT 5;";
  connection.query(query, (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All user recent transactions get succesfully!",
      result: result,
      status: 200,
    });
  });
};

const getAllPendingSubscriptionsController = (req: Request, res: Response) => {
  const query =
    "SELECT COUNT(*) as TotalPending FROM tbl_subscriptions WHERE SubscriptionStatus = 'Pending';";
  connection.query(query, (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All pending transactions get succesfully!",
      result: result,
      status: 200,
    });
  });
};
const getAllFulfillSubscriptionsController = (req: Request, res: Response) => {
  const query =
    "SELECT COUNT(*) as TotalFulfill FROM tbl_subscriptions WHERE SubscriptionStatus = 'Fulfill';";
  connection.query(query, (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All pending transactions get succesfully!",
      result: result,
      status: 200,
    });
  });
};

export {
  getSubscriptionHistoryController,
  getSubscriptionHistoryByDateController,
  getSpecificSubscriptionUserController,
  getUserSessionSubscriptionAlreadyPaidController,
  getUserMonthlySubscriptionAlreadyPaidController,
  getAllSubscriptionsAdminController,
  getAllSubscriptionsUserController,
  getAllSubscriptionsTotalTodayController,
  getAllSubscriptionsUserHistoryController,
  getAllSubscriptionsByDateController,
  getAllRecentSubscriptionsController,
  getAllPendingSubscriptionsController,
  getAllFulfillSubscriptionsController,
  adminCreateSubscriptionController,
  createSubscriptionController,
  fulfillSubscriptionController,
  insertSubscriptionController,
  editSubscriptionController,
  deleteSubscriptionController,
};
