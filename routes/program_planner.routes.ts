import express from "express";
import {
  createProgramController,
  getSpecificProgramController,
  getSpecificTodayProgramController,
  deleteProgramController,
  editProgramController,
} from "../controllers/program_planner.controllers";
const program_planner_routes = express.Router();

program_planner_routes.get(
  "/display_planner/:UserID",
  getSpecificProgramController
);
program_planner_routes.get(
  "/todays_program/:UserID",
  getSpecificTodayProgramController
);
program_planner_routes.post("/create_planner", createProgramController);
program_planner_routes.post("/edit_planner", editProgramController);
program_planner_routes.delete(
  "/delete_planner/:ProgramID",
  deleteProgramController
);
export default program_planner_routes;
