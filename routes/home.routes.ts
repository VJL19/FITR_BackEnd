import express from "express";
import {
  getTodayProgramController,
  getExercisesFavoriteController,
  getSuggestedProgramController,
  getWorkoutsFavoriteController,
} from "../controllers/home.controllers";

const home_routes = express.Router();

home_routes.get("/suggested_program", getSuggestedProgramController);
home_routes.post("/todays_program", getTodayProgramController);
home_routes.post("/workout_favorites", getWorkoutsFavoriteController);
home_routes.post("/exercise_favorites", getExercisesFavoriteController);

export default home_routes;
