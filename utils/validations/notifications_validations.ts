import Joi from "joi";
import INotifications from "../types/notifications.types";

const notify_validator = Joi.object<INotifications>({
  UserID: Joi.number().required(),
  PostID: Joi.number().required(),
  NotificationAuthor: Joi.string().required(),
  Username: Joi.string().required(),
  NotificationDate: Joi.string().required(),
  PostTitle: Joi.string().required(),
});

const notify_action_validator = Joi.object<INotifications>({
  UserID: Joi.number().required(),
  NotificationID: Joi.number().required(),
});
const get_action_validator = Joi.object<INotifications>({
  UserID: Joi.number().required(),
});
export { notify_validator, notify_action_validator, get_action_validator };
