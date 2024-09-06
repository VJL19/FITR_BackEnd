import Joi from "joi";
import {
  IExerciseFavorites,
  IWorkOutFavorites,
} from "../types/favorites.types";

const add_exercise_validator = Joi.object<IExerciseFavorites>({
  ExerciseID: Joi.number().required(),
  UserID: Joi.number().required(),
});

const add_workout_validator = Joi.object<IWorkOutFavorites>({
  WorkOutID: Joi.number().required(),
  UserID: Joi.number().required(),
});

const remove_workout_validator = Joi.object<IWorkOutFavorites>({
  WorkOutID: Joi.number().required(),
  UserID: Joi.number().required(),
});

const remove_exercise_validator = Joi.object<IExerciseFavorites>({
  ExerciseID: Joi.number().required(),
  UserID: Joi.number().required(),
});

const specific_workout_validator = Joi.object<IWorkOutFavorites>({
  UserID: Joi.number().required(),
});
const specific_exercise_validator = Joi.object<IExerciseFavorites>({
  UserID: Joi.number().required(),
});
export {
  add_exercise_validator,
  add_workout_validator,
  remove_workout_validator,
  remove_exercise_validator,
  specific_exercise_validator,
  specific_workout_validator,
};
