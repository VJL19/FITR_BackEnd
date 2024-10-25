import express from "express";
import {
  getDailySessionUserAttendeesController,
  getDailyMonthlyUserAttendeesController,
  getWeeklyMonthlyUserAttendeesController,
  getWeeklySessionUserAttendeesController,
  getMonthlySessionUserAttendeesController,
  getMonthlyMUserAttendeesController,
} from "../controllers/attendance_analytics.controller";
import verifyWebAuthToken from "../middlewares/verifyTokenWeb";

const attendance_analytics = express.Router();

attendance_analytics.get(
  "/daily_sessionUsers/attendees",
  verifyWebAuthToken,
  getDailySessionUserAttendeesController
);
attendance_analytics.get(
  "/daily_monthlyUsers/attendees",
  verifyWebAuthToken,
  getDailyMonthlyUserAttendeesController
);
attendance_analytics.get(
  "/weekly_sessionUsers/attendees/:selectedMonth",
  verifyWebAuthToken,
  getWeeklySessionUserAttendeesController
);
attendance_analytics.get(
  "/weekly_monthlyUsers/attendees/:selectedMonth",
  verifyWebAuthToken,
  getWeeklyMonthlyUserAttendeesController
);
attendance_analytics.get(
  "/monthly_sessionUsers/attendees/:selectedYear",
  verifyWebAuthToken,
  getMonthlySessionUserAttendeesController
);
attendance_analytics.get(
  "/monthly_mUsers/attendees/:selectedYear",
  verifyWebAuthToken,
  getMonthlyMUserAttendeesController
);

export default attendance_analytics;
