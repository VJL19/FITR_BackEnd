import express from "express";
import {
  getAllWorkouts,
  getWorkOutByCategory,
  getWorkOutByIntensity,
  getWorkOutByTargetMuscle,
  getAllWorkOutTutorial,
} from "../controllers/workout.controllers";

const workout_routes = express.Router();

workout_routes.get("/all_workouts", getAllWorkouts);
workout_routes.get(
  "/target_muscle:WorkOutTargetMuscle",
  getWorkOutByTargetMuscle
);
workout_routes.get("/intensity:WorkOutIntensity", getWorkOutByIntensity);
workout_routes.get("/category:WorkOutCategory", getWorkOutByCategory);
workout_routes.get("/tutorials:WorkOutID", getAllWorkOutTutorial);

export default workout_routes;
