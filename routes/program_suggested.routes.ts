import express from "express";
import {
  getProgramSuggested,
  getTotalProgramSuggested,
  editProgramSuggested,
  deleteProgramSuggested,
  createProgramSuggested,
} from "../controllers/program_suggested.controllers";
import verifyWebAuthToken from "../middlewares/verifyTokenWeb";
import verifyAuthToken from "../middlewares/verifyToken";

const program_suggested_routes = express.Router();
const program_suggested_user_routes = express.Router();

program_suggested_routes.get(
  "/program_suggested",
  verifyWebAuthToken,
  getProgramSuggested
);
program_suggested_user_routes.get(
  "/program_suggested",
  verifyAuthToken,
  getProgramSuggested
);
program_suggested_routes.get(
  "/total_program_suggested",
  verifyWebAuthToken,
  getTotalProgramSuggested
);
program_suggested_routes.post(
  "/create_program_suggested",
  verifyWebAuthToken,
  createProgramSuggested
);
program_suggested_routes.put(
  "/edit_program_suggested",
  verifyWebAuthToken,
  editProgramSuggested
);
program_suggested_routes.delete(
  "/program_suggested:SuggestedProgramID",
  verifyWebAuthToken,
  deleteProgramSuggested
);
export { program_suggested_user_routes };
export default program_suggested_routes;
