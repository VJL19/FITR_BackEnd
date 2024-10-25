import { Request, Response } from "express";
import connection from "../config/mysql";
import IUser from "../utils/types/user.types";
import INotifications from "../utils/types/notifications.types";
import {
  notify_validator,
  notify_action_validator,
  get_action_validator,
} from "../utils/validations/notifications_validations";
import { Expo } from "expo-server-sdk";
import { sendPushNotification } from "../utils/helpers/ExpoSdk";

const markAsReadNotification = (req: Request, res: Response) => {
  const { UserID, NotificationID } = <INotifications>req.body;

  const validate_fields = notify_action_validator.validate({
    UserID,
    NotificationID,
  });
  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "UPDATE tbl_notifications SET `isMarkRead` = 'true' WHERE `UserID` = ? AND `NotificationID` = ? LIMIT 1";

  connection.query(query, [UserID, NotificationID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Notification is successfully mark as read!",
      status: 200,
      result: result,
    });
  });
};

const markAsUnreadNotification = (req: Request, res: Response) => {
  const { UserID, NotificationID } = <INotifications>req.body;

  const validate_fields = notify_action_validator.validate({
    UserID,
    NotificationID,
  });
  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "UPDATE tbl_notifications SET `isMarkRead` = 'false' WHERE `UserID` = ? AND `NotificationID` = ? LIMIT 1";

  connection.query(query, [UserID, NotificationID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Notification is successfully mark as unread!",
      status: 200,
      result: result,
    });
  });
};

const getNotifications = (req: Request, res: Response) => {
  const UserID = req.params.UserID.split(":")[1];

  const validate_fields = get_action_validator.validate({ UserID });
  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "SELECT * FROM tbl_notifications as tbl_notif LEFT JOIN tbl_users tbl_u ON tbl_notif.NotificationAuthor = CONCAT(tbl_u.FirstName, ' ', tbl_u.LastName) WHERE tbl_notif.UserID = ? ORDER BY tbl_notif.NotificationDate DESC;";

  connection.query(query, [UserID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All notifications successfully display!",
      status: 200,
      result: result,
    });
  });
};
const getNotificationsCount = (req: Request, res: Response) => {
  const UserID = req.params.UserID.split(":")[1];

  const validate_fields = get_action_validator.validate({ UserID });
  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "select COUNT(*) as NotificationCount from tbl_notifications where `UserID` = ? AND `isMarkRead` = 'false';";

  connection.query(query, [UserID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All notifications successfully display!",
      status: 200,
      result: result,
    });
  });
};

const notify_user_like = (req: Request, res: Response) => {
  const {
    UserID,
    PostID,
    NotificationAuthor,
    Username,
    NotificationDate,
    PostTitle,
  } = <INotifications>req.body;

  const validate_fields = notify_validator.validate({
    UserID,
    PostID,
    NotificationAuthor,
    Username,
    NotificationDate,
    PostTitle,
  });
  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }
  const query = `INSERT INTO tbl_notifications (UserID, PostID, NotificationAuthor, NotificationText, isMarkRead, NotifBy, NotificationType, NotificationDate) VALUES (?,?, ?,'User ${Username} likes your ${PostTitle} post!', 'false', ?, 'like_notif', ?) LIMIT 1`;

  connection.query(
    query,
    [UserID, PostID, NotificationAuthor, Username, NotificationDate],
    (error, result) => {
      if (error) return res.status(400).json({ error: error, status: 400 });
      return res.status(200).json({
        message: "Successfully notify like to this post!",
        status: 200,
        result: result,
      });
    }
  );
};

const notify_user_comment = (req: Request, res: Response) => {
  const {
    UserID,
    PostID,
    NotificationAuthor,
    Username,
    NotificationDate,
    PostTitle,
  } = <INotifications>req.body;

  const validate_fields = notify_validator.validate({
    UserID,
    PostID,
    NotificationAuthor,
    Username,
    NotificationDate,
    PostTitle,
  });
  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }

  const query = `INSERT INTO tbl_notifications (UserID, PostID, NotificationAuthor, NotificationText, isMarkRead, NotifBy, NotificationType, NotificationDate) VALUES (?, ?, ?, 'User ${Username} commented to your ${PostTitle} post!', 'false', ?, 'comment_notif', ?) LIMIT 1`;

  connection.query(
    query,
    [UserID, PostID, NotificationAuthor, Username, NotificationDate],
    (error, result) => {
      if (error) {
        return res.status(400).json({ error: error, status: 400 });
      }
      return res.status(200).json({
        message: "Successfully notify commment to this post!",
        status: 200,
        result: result,
      });
    }
  );
};

const removeNotificationLike = (req: Request, res: Response) => {
  const { Username, PostID } = <INotifications>req.body;

  const query =
    "DELETE FROM tbl_notifications WHERE `NotifBy` = ? AND `NotificationType` = 'like_notif' AND `PostID` = ?";

  connection.query(query, [Username, PostID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Successfully remove the notification for this post!",
      status: 200,
      result: result,
    });
  });
};

const removeNotificationComment = (req: Request, res: Response) => {
  const { Username, PostID } = <INotifications>req.body;

  const query =
    "DELETE FROM tbl_notifications WHERE `NotifBy` = ? AND `NotificationType` = 'comment_notif' AND `PostID` = ?;";

  connection.query(query, [Username, PostID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Successfully remove the notification for this post!",
      status: 200,
      result: result,
    });
  });
};

const removeUserNotifications = (req: Request, res: Response) => {
  const PostID = req.params.PostID.split(":")[1];

  const query = "DELETE FROM tbl_notifications WHERE `PostID` = ?;";

  connection.query(query, [PostID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    console.log("delete all notifications from this post!", result);
    return res.status(200).json({
      message: "Successfully remove the notification for this post!",
      status: 200,
      result: result,
    });
  });
};

const expoSendNotification = async (req: Request, res: Response) => {
  const { expoPushToken } = req.body;

  console.log("hey in expo send", expoPushToken);
  if (Expo.isExpoPushToken(expoPushToken))
    await sendPushNotification(
      expoPushToken,
      "This is sent from back-end express :)"
    );

  return res
    .status(200)
    .json({ message: "Successfully sent the notification!", status: 200 });
};

export {
  markAsReadNotification,
  markAsUnreadNotification,
  expoSendNotification,
  getNotifications,
  notify_user_like,
  notify_user_comment,
  removeNotificationLike,
  removeNotificationComment,
  removeUserNotifications,
  getNotificationsCount,
};
