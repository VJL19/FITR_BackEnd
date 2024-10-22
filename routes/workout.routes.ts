import express from "express";
import {
  getAllWorkouts,
  getWorkOutByCategory,
  getWorkOutByIntensity,
  getWorkOutByTargetMuscle,
  getAllWorkOutTutorial,
} from "../controllers/workout.controllers";
import verifyAuthToken from "../middlewares/verifyToken";

const workout_routes = express.Router();

workout_routes.get("/all_workouts", verifyAuthToken, getAllWorkouts);
workout_routes.get(
  "/target_muscle:WorkOutTargetMuscle",
  verifyAuthToken,
  getWorkOutByTargetMuscle
);
workout_routes.get(
  "/intensity:WorkOutIntensity",
  verifyAuthToken,
  getWorkOutByIntensity
);
workout_routes.get(
  "/category:WorkOutCategory",
  verifyAuthToken,
  getWorkOutByCategory
);
workout_routes.get(
  "/tutorials:WorkOutID",
  verifyAuthToken,
  getAllWorkOutTutorial
);

export default workout_routes;
