import Joi from "joi";
import IProgramSuggested from "../types/program_suggested.types";

const create_suggested_validator = Joi.object<IProgramSuggested>({
  SuggestedProgramTitle: Joi.string().required(),
  SuggestedProgramDescription: Joi.string().required(),
  SuggestedProgramEntryDate: Joi.date().required(),
});

const edit_suggested_validator = Joi.object<IProgramSuggested>({
  SuggestedProgramID: Joi.number().required(),
  SuggestedProgramTitle: Joi.string().required(),
  SuggestedProgramDescription: Joi.string().required(),
  SuggestedProgramEntryDate: Joi.date().required(),
});

const delete_suggested_validator = Joi.object<IProgramSuggested>({
  SuggestedProgramID: Joi.number().required(),
});

export {
  create_suggested_validator,
  edit_suggested_validator,
  delete_suggested_validator,
};
