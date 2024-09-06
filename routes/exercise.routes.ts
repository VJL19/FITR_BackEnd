import express from "express";

import {
  getAllExercises,
  getExerciseByCategory,
  getExerciseByTargetMuscle,
  getExerciseByIntensity,
  getAllExerciseTutorial,
} from "../controllers/exercise.controllers";

const exercise_routes = express.Router();

exercise_routes.get("/all_exercises", getAllExercises);
exercise_routes.get(
  "/target_muscle:ExerciseTargetMuscle",
  getExerciseByTargetMuscle
);
exercise_routes.get("/intensity:ExerciseIntensity", getExerciseByIntensity);
exercise_routes.get("/category:ExerciseCategory", getExerciseByCategory);
exercise_routes.get("/tutorials:ExerciseID", getAllExerciseTutorial);
export default exercise_routes;
