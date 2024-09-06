import express from "express";
import {
  getProgramSuggested,
  getTotalProgramSuggested,
  editProgramSuggested,
  deleteProgramSuggested,
  createProgramSuggested,
} from "../controllers/program_suggested.controllers";

const program_suggested_routes = express.Router();

program_suggested_routes.get("/program_suggested", getProgramSuggested);
program_suggested_routes.get(
  "/total_program_suggested",
  getTotalProgramSuggested
);
program_suggested_routes.post(
  "/create_program_suggested",
  createProgramSuggested
);
program_suggested_routes.put("/edit_program_suggested", editProgramSuggested);
program_suggested_routes.delete(
  "/program_suggested:SuggestedProgramID",
  deleteProgramSuggested
);
export default program_suggested_routes;
