import Joi from "joi";
import IProgram from "../types/programs_planner.types";
import {
  IExerciseFavorites,
  IWorkOutFavorites,
} from "../types/favorites.types";

const today_program_validator = Joi.object<IProgram>({
  UserID: Joi.number().required(),
});

const workout_favorite_validator = Joi.object<IWorkOutFavorites>({
  UserID: Joi.number().required(),
  isWorkOutFavorite: Joi.boolean().required(),
});

const exercise_favorite_validator = Joi.object<IExerciseFavorites>({
  UserID: Joi.number().required(),
  isExerciseFavorite: Joi.boolean().required(),
});

export {
  today_program_validator,
  workout_favorite_validator,
  exercise_favorite_validator,
};
