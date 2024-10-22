import express from "express";

import {
  getAllExercises,
  getExerciseByCategory,
  getExerciseByTargetMuscle,
  getExerciseByIntensity,
  getAllExerciseTutorial,
} from "../controllers/exercise.controllers";
import verifyAuthToken from "../middlewares/verifyToken";

const exercise_routes = express.Router();

exercise_routes.get("/all_exercises", verifyAuthToken, getAllExercises);
exercise_routes.get(
  "/target_muscle:ExerciseTargetMuscle",
  verifyAuthToken,
  getExerciseByTargetMuscle
);
exercise_routes.get(
  "/intensity:ExerciseIntensity",
  verifyAuthToken,
  getExerciseByIntensity
);
exercise_routes.get(
  "/category:ExerciseCategory",
  verifyAuthToken,
  getExerciseByCategory
);
exercise_routes.get(
  "/tutorials:ExerciseID",
  verifyAuthToken,
  getAllExerciseTutorial
);
export default exercise_routes;
