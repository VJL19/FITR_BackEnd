import { Request, Response } from "express";
import connection from "../config/mysql";
import IProgram from "../utils/types/programs_planner.types";
import {
  IExerciseFavorites,
  IWorkOutFavorites,
} from "../utils/types/favorites.types";
import {
  today_program_validator,
  exercise_favorite_validator,
  workout_favorite_validator,
} from "../utils/validations/home_validations";

const getTodayProgramController = (req: Request, res: Response) => {
  const { UserID } = <IProgram>req.body;

  const validate_field = today_program_validator.validate({ UserID });

  if (validate_field.error) {
    return res.status(400).json({
      error: validate_field.error.details[0].message,
      status: 400,
    });
  }
  const query = "SELECT * FROM tbl_program_planner WHERE `UserID` = ?";
  connection.query(query, [UserID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All todays program successfully display!",
      result: result,
      status: 200,
    });
  });
};

const getSuggestedProgramController = (req: Request, res: Response) => {
  const query = "SELECT * FROM tbl_program_suggested";

  connection.query(query, (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All suggested program successfully display!",
      result: result,
      status: 200,
    });
  });
};

const getWorkoutsFavoriteController = (req: Request, res: Response) => {
  const { UserID, isWorkOutFavorite } = <IWorkOutFavorites>req.body;

  const validate_field = workout_favorite_validator.validate({
    UserID,
    isWorkOutFavorite,
  });

  if (validate_field.error) {
    return res.status(400).json({
      error: validate_field.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "SELECT * FROM tbl_workouts_favorites WHERE `UserID` = ? AND `isWorkOutFavorite` = ?";

  const values = [UserID, isWorkOutFavorite];
  connection.query(query, [values], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All workouts favorite is successfully display!",
      result: result,
      status: 200,
    });
  });
};
const getExercisesFavoriteController = (req: Request, res: Response) => {
  const { UserID, isExerciseFavorite } = <IExerciseFavorites>req.body;

  const validate_field = exercise_favorite_validator.validate({
    UserID,
    isExerciseFavorite,
  });

  if (validate_field.error) {
    return res.status(400).json({
      error: validate_field.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "SELECT * FROM tbl_exercises_favorites WHERE `UserID` = ? AND `isExerciseFavorite` = ?";

  const values = [UserID, isExerciseFavorite];
  connection.query(query, [values], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All exercises favorite is successfully display!",
      result: result,
      status: 200,
    });
  });
};

export {
  getTodayProgramController,
  getSuggestedProgramController,
  getWorkoutsFavoriteController,
  getExercisesFavoriteController,
};
