import Joi from "joi";
import IAnnouncements from "../types/announcements.types";

const create_announcement_validator = Joi.object<IAnnouncements>({
  AnnouncementImage: Joi.string().optional(),
  AnnouncementTitle: Joi.string().required(),
  AnnouncementDescription: Joi.string().required(),
  AnnouncementDate: Joi.date().required(),
});
const edit_announcement_validator = Joi.object<IAnnouncements>({
  AnnouncementID: Joi.number().required(),
  AnnouncementImage: Joi.string().optional(),
  AnnouncementTitle: Joi.string().required(),
  AnnouncementDescription: Joi.string().required(),
  AnnouncementDate: Joi.date().required(),
});

const delete_announcement_validator = Joi.object<IAnnouncements>({
  AnnouncementID: Joi.number().required(),
});

export {
  delete_announcement_validator,
  edit_announcement_validator,
  create_announcement_validator,
};
