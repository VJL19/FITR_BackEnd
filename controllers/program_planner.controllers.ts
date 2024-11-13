import { Request, Response } from "express";
import connection from "../config/mysql";
import IProgram from "../utils/types/programs_planner.types";

import {
  create_program_validator,
  delete_program_validator,
  edit_program_validator,
  specific_program_validator,
} from "../utils/validations/program_planner.validations";
import BadWordsNext from "bad-words-next";
import { fil } from "../utils/helpers/bad-words";
const en = require("bad-words-next/data/en.json");

const badwords = new BadWordsNext();
badwords.add(en);
badwords.add(fil);
const createProgramController = (req: Request, res: Response) => {
  const { UserID, ProgramTitle, ProgramDescription, ProgramEntryDate } = <
    IProgram
  >req.body;

  const validate_fields = create_program_validator.validate({
    UserID,
    ProgramTitle,
    ProgramDescription,
    ProgramEntryDate,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "INSERT INTO tbl_program_planner (`UserID`, `ProgramTitle`, `ProgramDescription`, `ProgramEntryDate`) VALUES (?);";

  const values = [
    UserID,
    badwords.filter(ProgramTitle),
    badwords.filter(ProgramDescription),
    ProgramEntryDate,
  ];
  connection.query(query, [values], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Program created successfully!",
      result: result,
      status: 200,
    });
  });
};

const editProgramController = (req: Request, res: Response) => {
  const {
    UserID,
    ProgramID,
    ProgramTitle,
    ProgramDescription,
    ProgramEntryDate,
  } = <IProgram>req.body;

  const validate_fields = edit_program_validator.validate({
    UserID,
    ProgramID,
    ProgramTitle,
    ProgramDescription,
    ProgramEntryDate,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "UPDATE tbl_program_planner SET `ProgramTitle` = ?, `ProgramDescription` = ?, `ProgramEntryDate` = ? WHERE `ProgramID` = ? AND `UserID` = ? LIMIT 1;";

  connection.query(
    query,
    [
      badwords.filter(ProgramTitle),
      badwords.filter(ProgramDescription),
      ProgramEntryDate,
      ProgramID,
      UserID,
    ],
    (error, result) => {
      if (error) return res.status(400).json({ error: error, status: 400 });

      return res.status(200).json({
        message: "Program edit successfully!",
        result: result,
        status: 200,
      });
    }
  );
};

const getSpecificTodayProgramController = (req: Request, res: Response) => {
  const UserID = req.params.UserID.split(":")[1];

  const validate_fields = specific_program_validator.validate({
    UserID,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "SELECT * FROM tbl_program_planner WHERE `UserID` = ? AND DATE(`ProgramEntryDate`) = CURDATE() ORDER BY `ProgramEntryDate` DESC;";

  connection.query(query, [UserID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All specific program today display successfully!",
      result: result,
      status: 200,
    });
  });
};

const getSpecificProgramController = (req: Request, res: Response) => {
  const UserID = req.params.UserID.split(":")[1];

  const validate_fields = specific_program_validator.validate({
    UserID,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "SELECT * FROM tbl_program_planner WHERE `UserID` = ? ORDER BY `ProgramEntryDate` DESC;";

  connection.query(query, [UserID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All specific program is display successfully!",
      result: result,
      status: 200,
    });
  });
};

const deleteProgramController = (req: Request, res: Response) => {
  const ProgramID = req.params.ProgramID.split(":")[1];

  const validate_fields = delete_program_validator.validate({
    ProgramID,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "DELETE FROM tbl_program_planner WHERE `ProgramID` = ? LIMIT 1;";

  connection.query(query, [ProgramID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Specific programm is deleted successfully!",
      result: result,
      status: 200,
    });
  });
};

export {
  getSpecificTodayProgramController,
  createProgramController,
  editProgramController,
  getSpecificProgramController,
  deleteProgramController,
};
