import connection from "../config/mysql";
import { IRecords } from "../utils/types/records.types";
import { Request, Response } from "express";
import {
  create_record_validator,
  delete_record_validator,
  edit_record_validator,
} from "../utils/validations/records_validations";

const getRecordsController = (req: Request, res: Response) => {
  const query = "SELECT * FROM tbl_records ORDER BY `RecordEntryDate` DESC;";

  connection.query(query, (error, result) => {
    if (error)
      return res.status(400).json({ error: error, message: error.sqlMessage });

    return res.status(200).json({
      message: "All records is successfully display!",
      status: 200,
      result: result,
    });
  });
};
const uploadRecordController = (req: Request, res: Response) => {
  const { RecordName, RecordDownloadLink, RecordEntryDate } = <IRecords>(
    req.body
  );

  const validate_fields = create_record_validator.validate({
    RecordName,
    RecordDownloadLink,
    RecordEntryDate,
  });

  if (validate_fields.error) {
    return res
      .status(400)
      .json({ error: validate_fields.error.details[0].message, status: 400 });
  }

  const query =
    "INSERT INTO tbl_records (`RecordName`, `RecordDownloadLink`, `RecordEntryDate`) VALUES (?)";
  const values = [RecordName, RecordDownloadLink, RecordEntryDate];
  connection.query(query, [values], (error, result) => {
    if (error)
      return res.status(400).json({ error: error, message: error.sqlMessage });

    return res.status(200).json({
      message: "Record is successfully uploaded!",
      status: 200,
      result: result,
    });
  });
};

const editRecordController = (req: Request, res: Response) => {
  const { RecordID, RecordName, RecordDownloadLink, RecordEntryDate } = <
    IRecords
  >req.body;

  const validate_fields = edit_record_validator.validate({
    RecordID,
    RecordName,
    RecordDownloadLink,
    RecordEntryDate,
  });

  if (validate_fields.error) {
    return res
      .status(400)
      .json({ error: validate_fields.error.details[0].message, status: 400 });
  }
  const query =
    "UPDATE tbl_records SET `RecordName` = ?, `RecordDownloadLink` = ?, `RecordEntryDate` = ? WHERE `RecordID` = ? LIMIT 1;";

  connection.query(
    query,
    [RecordName, RecordDownloadLink, RecordEntryDate, RecordID],
    (error, result) => {
      if (error)
        return res
          .status(400)
          .json({ error: error, message: error.sqlMessage });

      return res.status(200).json({
        message: "Record is successfully edited!",
        status: 200,
        result: result,
      });
    }
  );
};

const deleteRecordController = (req: Request, res: Response) => {
  const RecordID = req.params.RecordID.split(":")[1];

  const validate_fields = delete_record_validator.validate({
    RecordID,
  });

  if (validate_fields.error) {
    return res
      .status(400)
      .json({ error: validate_fields.error.details[0].message, status: 400 });
  }
  const query = "DELETE FROM tbl_records WHERE `RecordID` = ? LIMIT 1;";

  connection.query(query, [RecordID], (error, result) => {
    if (error)
      return res.status(400).json({ error: error, message: error.sqlMessage });

    return res.status(200).json({
      message: "Record is successfully deleted!",
      status: 200,
      result: result,
    });
  });
};

export {
  getRecordsController,
  uploadRecordController,
  editRecordController,
  deleteRecordController,
};
