import Joi from "joi";
import { IRecords } from "../types/records.types";

const create_record_validator = Joi.object<IRecords>({
  RecordName: Joi.string().required(),
  RecordDownloadLink: Joi.string().required(),
  RecordEntryDate: Joi.date().required(),
});

const edit_record_validator = Joi.object<IRecords>({
  RecordID: Joi.number().required(),
  RecordName: Joi.string().required(),
  RecordDownloadLink: Joi.string().required(),
  RecordEntryDate: Joi.date().required(),
});

const delete_record_validator = Joi.object<IRecords>({
  RecordID: Joi.number().required(),
});

export {
  create_record_validator,
  edit_record_validator,
  delete_record_validator,
};
