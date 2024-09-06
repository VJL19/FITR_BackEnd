import Joi from "joi";
import IExercises from "../types/exercises.types";

const exercise_target_muscle = Joi.object<IExercises>({
  ExerciseTargetMuscle: Joi.string().required(),
});
const exercise_intensity = Joi.object<IExercises>({
  ExerciseIntensity: Joi.string().required(),
});
const exercise_category = Joi.object<IExercises>({
  ExerciseCategory: Joi.string().required(),
});
const exercise_tutorials = Joi.object<IExercises>({
  ExerciseID: Joi.number().required(),
});

export {
  exercise_target_muscle,
  exercise_intensity,
  exercise_category,
  exercise_tutorials,
};
