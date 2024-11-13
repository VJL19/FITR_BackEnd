import { Request, Response } from "express";
import connection from "../config/mysql";
import {
  IWorkOutFavorites,
  IExerciseFavorites,
} from "../utils/types/favorites.types";
import {
  add_exercise_validator,
  add_workout_validator,
  remove_exercise_validator,
  remove_workout_validator,
  specific_exercise_validator,
  specific_workout_validator,
} from "../utils/validations/favorite.validations";

const addExerciseFavorite = (req: Request, res: Response) => {
  const { ExerciseID, UserID } = <IExerciseFavorites>req.body;

  const validate_add_exercise = add_exercise_validator.validate({
    ExerciseID,
    UserID,
  });

  if (validate_add_exercise.error) {
    return res.status(400).json({
      error: validate_add_exercise.error.details[0].message,
      status: 400,
    });
  }

  const query =
    "INSERT INTO tbl_exercises_favorites (ExerciseID, UserID, isExerciseFavorite) VALUES (?, ?, 'true');";
  connection.query(query, [ExerciseID, UserID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "This exercise is sucessfully added to your favorites!",
      result: result,
      status: 200,
    });
  });
};

const addWorkOutFavorite = (req: Request, res: Response) => {
  const { WorkOutID, UserID } = <IWorkOutFavorites>req.body;

  const validate_add_workout = add_workout_validator.validate({
    WorkOutID,
    UserID,
  });

  if (validate_add_workout.error) {
    return res.status(400).json({
      error: validate_add_workout.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "INSERT INTO tbl_workouts_favorites (WorkOutID, UserID, isWorkOutFavorite) VALUES (?, ?, 'true');";

  connection.query(query, [WorkOutID, UserID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "This workout is successfully added to your favorites!",
      status: 200,
      result: result,
    });
  });
};

const removeWorkOutFavorite = (req: Request, res: Response) => {
  const { WorkOutID, UserID } = <IWorkOutFavorites>req.body;

  const validate_remove_workout = remove_workout_validator.validate({
    UserID,
    WorkOutID,
  });

  if (validate_remove_workout.error) {
    return res.status(400).json({
      error: validate_remove_workout.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "DELETE FROM tbl_workouts_favorites WHERE `WorkOutID` = ? AND `UserID` = ? LIMIT 1;";

  connection.query(query, [WorkOutID, UserID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Workout successfully removed to your favorites!",
      status: 200,
      result: result,
    });
  });
};

const removeExerciseFavorite = (req: Request, res: Response) => {
  const { ExerciseID, UserID } = <IExerciseFavorites>req.body;

  const validate_remove_exercise = remove_exercise_validator.validate({
    ExerciseID,
    UserID,
  });

  if (validate_remove_exercise.error) {
    return res.status(400).json({
      error: validate_remove_exercise.error.details[0].message,
      status: 400,
    });
  }

  const query =
    "DELETE FROM tbl_exercises_favorites WHERE `ExerciseID` = ? AND `UserID` = ? LIMIT 1;";

  connection.query(query, [ExerciseID, UserID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Exercise successfully removed to your favorites!",
      status: 200,
      result: result,
    });
  });
};

const getSpecificExerciseFavorites = (req: Request, res: Response) => {
  const UserID = req.params.UserID.split(":")[1];

  const validate_specific_exercise = specific_exercise_validator.validate({
    UserID,
  });

  if (validate_specific_exercise.error) {
    return res.status(400).json({
      error: validate_specific_exercise.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "SELECT * FROM tbl_exercises_favorites tbl_exe_fav LEFT JOIN tbl_exercises tbl_exe ON tbl_exe_fav.ExerciseID = tbl_exe.ExerciseID WHERE tbl_exe_fav.UserID = ? ORDER BY tbl_exe_fav.ExerciseFavoriteID DESC;";

  connection.query(query, [UserID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All specific exercise favorites is successfully get!",
      status: 200,
      result: result,
    });
  });
};

const getSpecificWorkoutFavorites = (req: Request, res: Response) => {
  const UserID = req.params.UserID.split(":")[1];

  const validate_specific_workout = specific_workout_validator.validate({
    UserID,
  });
  if (validate_specific_workout.error) {
    return res.status(400).json({
      error: validate_specific_workout.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "SELECT * FROM tbl_workouts_favorites tbl_work_fav LEFT JOIN tbl_workouts tbl_work ON tbl_work_fav.WorkOutID = tbl_work.WorkOutID WHERE tbl_work_fav.UserID = ? ORDER BY tbl_work_fav.WorkOutFavoriteID DESC";

  connection.query(query, [UserID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All specific workout favorites is successfully get!",
      status: 200,
      result: result,
    });
  });
};

const checkExerciseFavorite = (req: Request, res: Response) => {
  const { ExerciseID, UserID } = <IExerciseFavorites>req.body;

  const validate_add_exercise = add_exercise_validator.validate({
    ExerciseID,
    UserID,
  });

  if (validate_add_exercise.error) {
    return res.status(400).json({
      error: validate_add_exercise.error.details[0].message,
      status: 400,
    });
  }

  const query =
    "SELECT * FROM tbl_exercises_favorites WHERE `ExerciseID` = ? AND `UserID` = ?";
  connection.query(query, [ExerciseID, UserID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "You already have this workout to your favorites!",
      result: result,
      status: 200,
    });
  });
};
const checkWorkOutFavorite = (req: Request, res: Response) => {
  const { WorkOutID, UserID } = <IWorkOutFavorites>req.body;

  const validate_add_exercise = add_workout_validator.validate({
    WorkOutID,
    UserID,
  });

  if (validate_add_exercise.error) {
    return res.status(400).json({
      error: validate_add_exercise.error.details[0].message,
      status: 400,
    });
  }

  const query =
    "SELECT * FROM tbl_workouts_favorites WHERE `WorkOutID` = ? AND `UserID` = ?";
  connection.query(query, [WorkOutID, UserID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "You already have this workout to your favorites!",
      result: result,
      status: 200,
    });
  });
};

export {
  getSpecificWorkoutFavorites,
  getSpecificExerciseFavorites,
  addExerciseFavorite,
  addWorkOutFavorite,
  removeWorkOutFavorite,
  removeExerciseFavorite,
  checkExerciseFavorite,
  checkWorkOutFavorite,
};
