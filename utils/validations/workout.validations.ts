import Joi from "joi";
import IWorkouts from "../types/workouts.types";

const workout_target_muscle = Joi.object<IWorkouts>({
  WorkOutTargetMuscle: Joi.string().required(),
});
const workout_intensity = Joi.object<IWorkouts>({
  WorkOutIntensity: Joi.string().required(),
});
const workout_category = Joi.object<IWorkouts>({
  WorkOutCategory: Joi.string().required(),
});
const workout_tutorials = Joi.object<IWorkouts>({
  WorkOutID: Joi.number().required(),
});

export {
  workout_target_muscle,
  workout_intensity,
  workout_category,
  workout_tutorials,
};
