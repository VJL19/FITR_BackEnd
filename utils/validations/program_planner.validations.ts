import Joi from "joi";
import IProgram from "../types/programs_planner.types";

const create_program_validator = Joi.object<IProgram>({
  UserID: Joi.number().required(),
  ProgramTitle: Joi.string().required(),
  ProgramDescription: Joi.string().required(),
  ProgramEntryDate: Joi.date().required(),
});

const edit_program_validator = Joi.object<IProgram>({
  UserID: Joi.number().required(),
  ProgramID: Joi.number().required(),
  ProgramTitle: Joi.string().required(),
  ProgramDescription: Joi.string().required(),
  ProgramEntryDate: Joi.date().required(),
});

const specific_program_validator = Joi.object<IProgram>({
  UserID: Joi.number().required(),
});

const delete_program_validator = Joi.object<IProgram>({
  ProgramID: Joi.number().required(),
});

export {
  create_program_validator,
  edit_program_validator,
  specific_program_validator,
  delete_program_validator,
};
