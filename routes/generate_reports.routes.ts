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

const generate_reports_routes = express.Router();

//for attendance report routes.
generate_reports_routes.get(
  "/attendance/specific_date:selectedDate",
  getAttendanceSpecificDate
);
generate_reports_routes.get(
  "/attendance/all_users/specific_date:selectedDate",
  getTotalUsersAttendanceBySpecificDate
);
generate_reports_routes.get(
  "/attendance/all_session_users/specific_date:selectedDate",
  getTotalSessionUsersAttendanceBySpecificDate
);
generate_reports_routes.get(
  "/attendance/all_monthly_users/specific_date:selectedDate",
  getTotalMonthlyUsersAttendanceBySpecificDate
);
generate_reports_routes.post(
  "/attendance/weekly_range",
  getAttendanceWeeklyByRange
);
generate_reports_routes.get(
  "/attendance/specific_year:selectedYear",
  getAttendanceWithinYear
);

//for financial report routes.
generate_reports_routes.get(
  "/sales/specific_date:selectedDate",
  getSalesSpecificDate
);
generate_reports_routes.get(
  "/sales/specific_month:selectedMonth",
  getSalesSpecificMonth
);
generate_reports_routes.post("/sales/weekly_range", getSalesWeeklyByRange);
generate_reports_routes.get(
  "/sales/specific_year:selectedYear",
  getSalesWithinYear
);

export default generate_reports_routes;
