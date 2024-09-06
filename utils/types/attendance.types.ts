import IUser from "./user.types";

interface IAttendance extends IUser {
  AttendanceID: number;
  SubscriptionType: string;
  TimeIn: string;
  TimeOut: string;
  SubscriptionExpectedEnd: string;
  DateTapped: string;
  IsPaid: string;
}

export default IAttendance;
