import express from "express";
import {
  createProgramController,
  getSpecificProgramController,
  getSpecificTodayProgramController,
  deleteProgramController,
  editProgramController,
} from "../controllers/program_planner.controllers";
import verifyAuthToken from "../middlewares/verifyToken";
const program_planner_routes = express.Router();

program_planner_routes.get(
  "/display_planner/:UserID",
  verifyAuthToken,
  getSpecificProgramController
);
program_planner_routes.get(
  "/todays_program/:UserID",
  verifyAuthToken,
  getSpecificTodayProgramController
);
program_planner_routes.post(
  "/create_planner",
  verifyAuthToken,
  createProgramController
);
program_planner_routes.post(
  "/edit_planner",
  verifyAuthToken,
  editProgramController
);
program_planner_routes.delete(
  "/delete_planner/:ProgramID",
  verifyAuthToken,
  deleteProgramController
);
export default program_planner_routes;
