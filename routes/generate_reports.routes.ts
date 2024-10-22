import express from "express";
import {
  getAttendanceSpecificDate,
  getTotalUsersAttendanceBySpecificDate,
  getTotalSessionUsersAttendanceBySpecificDate,
  getTotalMonthlyUsersAttendanceBySpecificDate,
  getAttendanceSpecificMonth,
  getAttendanceWeeklyByRange,
  getAttendanceWithinYear,
  getSalesSpecificDate,
  getSalesSpecificMonth,
  getSalesWeeklyByRange,
  getSalesWithinYear,
} from "../controllers/generate_reports.controllers";
import verifyWebAuthToken from "../middlewares/verifyTokenWeb";

const generate_reports_routes = express.Router();

//for attendance report routes.
generate_reports_routes.get(
  "/attendance/specific_date:selectedDate",
  verifyWebAuthToken,
  getAttendanceSpecificDate
);
generate_reports_routes.get(
  "/attendance/all_users/specific_date:selectedDate",
  verifyWebAuthToken,
  getTotalUsersAttendanceBySpecificDate
);
generate_reports_routes.get(
  "/attendance/all_session_users/specific_date:selectedDate",
  verifyWebAuthToken,
  getTotalSessionUsersAttendanceBySpecificDate
);
generate_reports_routes.get(
  "/attendance/all_monthly_users/specific_date:selectedDate",
  verifyWebAuthToken,
  getTotalMonthlyUsersAttendanceBySpecificDate
);
generate_reports_routes.post(
  "/attendance/weekly_range",
  verifyWebAuthToken,
  getAttendanceWeeklyByRange
);
generate_reports_routes.get(
  "/attendance/specific_year:selectedYear",
  verifyWebAuthToken,
  getAttendanceWithinYear
);

//for financial report routes.
generate_reports_routes.get(
  "/sales/specific_date:selectedDate",
  verifyWebAuthToken,
  getSalesSpecificDate
);
generate_reports_routes.get(
  "/sales/specific_month:selectedMonth",
  verifyWebAuthToken,
  getSalesSpecificMonth
);
generate_reports_routes.post(
  "/sales/weekly_range",
  verifyWebAuthToken,
  getSalesWeeklyByRange
);
generate_reports_routes.get(
  "/sales/specific_year:selectedYear",
  verifyWebAuthToken,
  getSalesWithinYear
);

export default generate_reports_routes;
