import express from "express";
import {
  uploadRecordController,
  deleteRecordController,
  editRecordController,
  getRecordsController,
} from "../controllers/records.controller";
import verifyWebAuthToken from "../middlewares/verifyTokenWeb";

const records_routes = express.Router();

records_routes.get("/all_records", verifyWebAuthToken, getRecordsController);
records_routes.post(
  "/upload_record",
  verifyWebAuthToken,
  uploadRecordController
);
records_routes.put("/edit_record", verifyWebAuthToken, editRecordController);
records_routes.delete(
  "/delete_record/:RecordID",
  verifyWebAuthToken,
  deleteRecordController
);

export default records_routes;
