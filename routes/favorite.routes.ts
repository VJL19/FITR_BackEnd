import express from "express";

import {
  addWorkOutFavorite,
  addExerciseFavorite,
  removeExerciseFavorite,
  removeWorkOutFavorite,
  getSpecificExerciseFavorites,
  getSpecificWorkoutFavorites,
  checkExerciseFavorite,
  checkWorkOutFavorite,
} from "../controllers/favorite.controllers";
import verifyAuthToken from "../middlewares/verifyToken";

const workout_favorite_routes = express.Router();
const exercise_favorite_routes = express.Router();
workout_favorite_routes.get("/workouts/:UserID", getSpecificWorkoutFavorites);
workout_favorite_routes.post("/workout/check_favorite", checkWorkOutFavorite);
workout_favorite_routes.post(
  "/workout/add_favorite",
  verifyAuthToken,
  addWorkOutFavorite
);

workout_favorite_routes.post(
  "/workout/remove_favorite",
  verifyAuthToken,
  removeWorkOutFavorite
);
exercise_favorite_routes.get(
  "/exercises/:UserID",
  getSpecificExerciseFavorites
);
exercise_favorite_routes.post(
  "/exercise/check_favorite",
  checkExerciseFavorite
);
exercise_favorite_routes.post(
  "/exercise/add_favorite",
  verifyAuthToken,
  addExerciseFavorite
);
exercise_favorite_routes.post(
  "/exercise/remove_favorite",
  verifyAuthToken,
  removeExerciseFavorite
);

export { workout_favorite_routes, exercise_favorite_routes };
