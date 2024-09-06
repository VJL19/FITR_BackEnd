import { Request, Response } from "express";
import connection from "../config/mysql";
import IProgramSuggested from "../utils/types/program_suggested.types";
import {
  create_suggested_validator,
  edit_suggested_validator,
  delete_suggested_validator,
} from "../utils/validations/program_suggested.validations";
import clients from "../global/socket.global";

const getProgramSuggested = (req: Request, res: Response) => {
  const query =
    "SELECT * from tbl_program_suggested ORDER BY `SuggestedProgramEntryDate` DESC;";

  connection.query(query, (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All program suggested display successfully!",
      status: 200,
      result: result,
    });
  });
};
const getTotalProgramSuggested = (req: Request, res: Response) => {
  const query =
    "SELECT COUNT(*) as TotalProgramSuggested FROM tbl_program_suggested;";

  connection.query(query, (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All total program suggested display successfully!",
      status: 200,
      result: result,
    });
  });
};

const createProgramSuggested = (req: Request, res: Response) => {
  const {
    SuggestedProgramTitle,
    SuggestedProgramDescription,
    SuggestedProgramEntryDate,
  } = <IProgramSuggested>req.body;

  const validate_fields = create_suggested_validator.validate({
    SuggestedProgramTitle,
    SuggestedProgramDescription,
    SuggestedProgramEntryDate,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "INSERT INTO tbl_program_suggested (`SuggestedProgramTitle`, `SuggestedProgramDescription`, `SuggestedProgramEntryDate`) VALUES (?) LIMIT 1;";

  const values = [
    SuggestedProgramTitle,
    SuggestedProgramDescription,
    SuggestedProgramEntryDate,
  ];
  connection.query(query, [values], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    for (var i in clients) {
      clients[i].emit("refresh_suggested_programs");
    }
    return res.status(200).json({
      message: "Program suuggested created successfully!",
      status: 200,
      result: result,
    });
  });
};

const editProgramSuggested = (req: Request, res: Response) => {
  const {
    SuggestedProgramID,
    SuggestedProgramTitle,
    SuggestedProgramDescription,
    SuggestedProgramEntryDate,
  } = <IProgramSuggested>req.body;

  const validate_fields = edit_suggested_validator.validate({
    SuggestedProgramID,
    SuggestedProgramTitle,
    SuggestedProgramDescription,
    SuggestedProgramEntryDate,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "UPDATE tbl_program_suggested SET `SuggestedProgramTitle` = ?, `SuggestedProgramDescription` = ?, `SuggestedProgramEntryDate` = ? WHERE `SuggestedProgramID` = ? LIMIT 1;";

  connection.query(
    query,
    [
      SuggestedProgramTitle,
      SuggestedProgramDescription,
      SuggestedProgramEntryDate,
      SuggestedProgramID,
    ],
    (error, result) => {
      if (error) return res.status(400).json({ error: error, status: 400 });

      for (var i in clients) {
        clients[i].emit("refresh_suggested_programs", { shouldRefresh: true });
      }
      return res.status(200).json({
        message: "Program suuggested edited successfully!",
        status: 200,
        result: result,
      });
    }
  );
};

const deleteProgramSuggested = (req: Request, res: Response) => {
  const SuggestedProgramID = req.params.SuggestedProgramID.split(":")[1];

  const validate_fields = delete_suggested_validator.validate({
    SuggestedProgramID,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "DELETE FROM tbl_program_suggested WHERE `SuggestedProgramID` = ? LIMIT 1";

  connection.query(query, [SuggestedProgramID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    for (var i in clients) {
      clients[i].emit("refresh_suggested_programs", { shouldRefresh: true });
    }
    return res.status(200).json({
      message: "Program suggested deleted successfully!",
      status: 200,
      result: result,
    });
  });
};
export {
  getProgramSuggested,
  getTotalProgramSuggested,
  createProgramSuggested,
  editProgramSuggested,
  deleteProgramSuggested,
};
