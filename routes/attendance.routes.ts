import express from "express";
import {
  tapRFIDCardController,
  generateSecretCodeController,
  updateIsPaidRecordsController,
  createUserRecordController,
  editUserRecordController,
  deleteUserRecordController,
  checkUserTapRFID,
  checkUserRFIDExist,
  getUserSpecificRecord,
  getUserAttendanceHistory,
  getAllUserAttendance,
  getAllRecentAttendance,
  getUserAttendanceHistoryByDate,
  getUserRFIDNumber,
} from "../controllers/attendance.controllers";
import verifyAuthToken from "../middlewares/verifyToken";

const attendance_routes = express.Router();

const attendance_routes_admin = express.Router();

attendance_routes.get("/specific_record/:UserID", getUserSpecificRecord);
attendance_routes.get("/attendance_history/:UserID", getUserAttendanceHistory);
attendance_routes.get("/RFIDNumber/:UserID", getUserRFIDNumber);
attendance_routes.post(
  "/attendance_history_date",
  getUserAttendanceHistoryByDate
);
attendance_routes.post("/record_user", verifyAuthToken, tapRFIDCardController);
attendance_routes.get(
  "/checkUserTapRFID/:UserID",
  verifyAuthToken,
  checkUserTapRFID
);
attendance_routes_admin.get(
  "/generate_code",
  verifyAuthToken,
  generateSecretCodeController
);
attendance_routes_admin.get("/checkUserTapRFID/:UserID", checkUserTapRFID);
attendance_routes_admin.post("/record_user", tapRFIDCardController);
attendance_routes_admin.get("/checkUserRFID/:RFIDNumber", checkUserRFIDExist);
attendance_routes_admin.get("/users_attendance", getAllUserAttendance);
attendance_routes_admin.get("/all_recent_attendance", getAllRecentAttendance);
attendance_routes_admin.post("/create_record", createUserRecordController);
attendance_routes_admin.post("/update_isPaid", updateIsPaidRecordsController);
attendance_routes_admin.post("/update_record", editUserRecordController);
attendance_routes_admin.delete(
  "/delete_record:AttendanceID",
  deleteUserRecordController
);

export { attendance_routes, attendance_routes_admin };
