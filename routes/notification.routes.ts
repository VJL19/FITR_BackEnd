import express from "express";
import {
  getNotifications,
  getNotificationsCount,
  markAsReadNotification,
  markAsUnreadNotification,
  notify_user_like,
  notify_user_comment,
  removeNotificationLike,
  removeNotificationComment,
  removeUserNotifications,
} from "../controllers/notification.controllers";
import verifyAuthToken from "../middlewares/verifyToken";

const notification_routes = express.Router();

notification_routes.post(
  "/readNotifications",
  verifyAuthToken,
  markAsReadNotification
);
notification_routes.post(
  "/unreadNotifications",
  verifyAuthToken,
  markAsUnreadNotification
);

notification_routes.get(
  "/getNotifications/:UserID",
  verifyAuthToken,
  getNotifications
);
notification_routes.get(
  "/getNotificationsCount/:UserID",
  getNotificationsCount
);
notification_routes.post("/notify_like", notify_user_like);
notification_routes.post("/notify_comment", notify_user_comment);
notification_routes.post("/remove_notification", removeNotificationLike);
notification_routes.post(
  "/remove_notification_comment",
  removeNotificationComment
);
notification_routes.delete(
  "/remove_user_notifications/:PostID",
  removeUserNotifications
);

export default notification_routes;
