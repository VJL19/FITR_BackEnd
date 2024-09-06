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

//if the user has a mobile phone.
const createSubscriptionController = (req: Request, res: Response) => {
  const {
    UserID,
    SubscriptionAmount,
    SubscriptionBy,
    SubscriptionType,
    SubscriptionMethod,
    SubscriptionUploadedImage,
    SubscriptionEntryDate,
  } = <ISubscriptions>req.body;

  const validate_fields = scan_subscription_validator.validate({
    UserID,
    SubscriptionAmount,
    SubscriptionBy,
    SubscriptionType,
    SubscriptionMethod,
    SubscriptionUploadedImage,
    SubscriptionEntryDate,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }

  const query =
    "INSERT INTO tbl_subscriptions (`UserID`, `SubscriptionAmount`, `SubscriptionBy`, `SubscriptionType`, `SubscriptionMethod`, `SubscriptionUploadedImage`, `SubscriptionStatus`, `SubscriptionEntryDate`) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?) LIMIT 1;";

  connection.query(
    query,
    [
      UserID,
      SubscriptionAmount,
      SubscriptionBy,
      SubscriptionType,
      SubscriptionMethod,
      SubscriptionUploadedImage,
      SubscriptionEntryDate,
    ],
    (error, result) => {
      if (error) return res.status(400).json({ error: error, status: 400 });

      for (let i in clients) {
        clients[i].emit("refresh_transaction");
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
    "INSERT INTO tbl_subscriptions (`UserID`, `SubscriptionAmount`, `SubscriptionBy`, `SubscriptionType`, `SubscriptionMethod`, `SubscriptionUploadedImage`, `SubscriptionStatus`, `SubscriptionEntryDate`) VALUES(NULL, ?, ?, ?, ?, 'default_poster.png', 'pending', CURRENT_TIMESTAMP());";

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
    "UPDATE tbl_subscriptions SET `SubscriptionStatus` = ? WHERE `SubscriptionID` = ? LIMIT 1;";

  connection.query(
    query,
    [SubscriptionStatus, SubscriptionID],
    (error, result) => {
      if (error) return res.status(400).json({ error: error, status: 400 });

      for (var i in clients) {
        clients[i].emit("refresh_subscriptionPage");
      }
      return res.status(200).json({
        message: "Subscription fulfill successfully!",
        result: result,
        status: 200,
      });
    }
  );
};

const getAllSubscriptionsByDateController = (req: Request, res: Response) => {
  const selectedDate = req.params.selectedDate.split(":")[1];

  const query =
    "SELECT s.UserID,  s.SubscriptionID, u.LastName, u.FirstName, u.MiddleName, s.SubscriptionAmount, s.SubscriptionType, s.SubscriptionUploadedImage, s.SubscriptionStatus, s.SubscriptionEntryDate FROM tbl_subscriptions s LEFT JOIN tbl_users u ON s.UserID = u.UserID WHERE DATE(s.SubscriptionEntryDate) = DATE(?) AND s.SubscriptionStatus = 'Fulfill';";

  connection.query(query, [selectedDate], (error, result) => {
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
    "SELECT s.UserID, s.SubscriptionID, u.ProfilePic, s.SubscriptionBy, s.SubscriptionAmount, s.SubscriptionType, s.SubscriptionMethod, s.SubscriptionUploadedImage, s.SubscriptionStatus, s.SubscriptionEntryDate FROM tbl_subscriptions s LEFT JOIN tbl_users u ON s.UserID = u.UserID ORDER BY s.SubscriptionEntryDate DESC;";

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
    "SELECT * FROM tbl_subscriptions WHERE `UserID` = ? AND `SubscriptionStatus` = 'pending' LIMIT 1;";

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
    "SELECT * FROM tbl_subscriptions WHERE `UserID` = ? AND `SubscriptionStatus` != 'Pending' AND DATE(SubscriptionEntryDate) = DATE(?) ORDER BY SubscriptionEntryDate DESC;";

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
    "SELECT s.UserID,  s.SubscriptionID, u.ProfilePic, u.LastName, u.FirstName, u.MiddleName, s.SubscriptionBy, s.SubscriptionAmount, s.SubscriptionType, s.SubscriptionUploadedImage, s.SubscriptionStatus, s.SubscriptionEntryDate FROM tbl_subscriptions s LEFT JOIN tbl_users u ON s.UserID = u.UserID ORDER BY s.SubscriptionEntryDate DESC LIMIT 5;";
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
  getAllSubscriptionsAdminController,
  getAllSubscriptionsUserController,
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
