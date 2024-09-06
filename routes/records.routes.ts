import express from "express";
import {
  uploadRecordController,
  deleteRecordController,
  editRecordController,
  getRecordsController,
} from "../controllers/records.controller";

const records_routes = express.Router();

records_routes.get("/all_records", getRecordsController);
records_routes.post("/upload_record", uploadRecordController);
records_routes.put("/edit_record", editRecordController);
records_routes.delete("/delete_record/:RecordID", deleteRecordController);

export default records_routes;
