import Joi from "joi";
import IAttendance from "../types/attendance.types";

const attendance_validator = Joi.object<IAttendance>({
  UserID: Joi.number().required(),
  ProfilePic: Joi.string().optional(),
  LastName: Joi.string().required(),
  FirstName: Joi.string().required(),
  SubscriptionType: Joi.string().required(),
  SubscriptionExpectedEnd: Joi.string().required(),
  DateTapped: Joi.date().required(),
  IsPaid: Joi.string().required(),
  TimeIn: Joi.string().required(),
  TimeOut: Joi.string().required(),
});

const create_userRecord_validator = Joi.object<IAttendance>({
  ProfilePic: Joi.string().optional(),
  LastName: Joi.string().required(),
  FirstName: Joi.string().required(),
  SubscriptionType: Joi.string().required(),
  DateTapped: Joi.date().required(),
  TimeIn: Joi.string().required(),
  TimeOut: Joi.string().required(),
});

const edit_userRecord_validator = Joi.object<IAttendance>({
  AttendanceID: Joi.number().required(),
  ProfilePic: Joi.string().optional(),
  TimeIn: Joi.string().required(),
  TimeOut: Joi.string().required(),
});

const delete_userRecord_validator = Joi.object<IAttendance>({
  AttendanceID: Joi.string().required(),
});
export {
  attendance_validator,
  create_userRecord_validator,
  edit_userRecord_validator,
  delete_userRecord_validator,
};
