import IExercises from "./exercises.types";
import IUser from "./user.types";
import IWorkouts from "./workouts.types";

interface IWorkOutFavorites extends IWorkouts, IUser {
  WorkOutFavoriteID: number;
  isWorkOutFavorite: boolean;
}

interface IExerciseFavorites extends IExercises, IUser {
  ExerciseFavoriteID: number;
  isExerciseFavorite: boolean;
}

export { IExerciseFavorites, IWorkOutFavorites };
