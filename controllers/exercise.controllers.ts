import { Request, Response } from "express";
import connection from "../config/mysql";
import IExercises from "../utils/types/exercises.types";
import {
  exercise_category,
  exercise_intensity,
  exercise_target_muscle,
  exercise_tutorials,
} from "../utils/validations/exercise.validations";

const getExerciseByTargetMuscle = (req: Request, res: Response) => {
  const ExerciseTargetMuscle = req.params.ExerciseTargetMuscle.split(":")[1];

  const validate_fields = exercise_target_muscle.validate({
    ExerciseTargetMuscle,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }

  if (ExerciseTargetMuscle === "All") {
    const query =
      "SELECT * FROM tbl_exercises WHERE `ExerciseEquipment` = 'body only'";

    connection.query(query, [ExerciseTargetMuscle], (error, result) => {
      if (error) return res.status(400).json({ error: error, status: 400 });
      return res.status(200).json({
        message: "All exercises by target muscle successfully display!",
        status: 200,
        exercise_results: result,
      });
    });
    return;
  }
  const query =
    "SELECT * FROM tbl_exercises WHERE `ExerciseEquipment` = 'body only' AND `ExerciseTargetMuscle` = ?";

  connection.query(query, [ExerciseTargetMuscle], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });
    return res.status(200).json({
      message: "All exercises by target muscle successfully display!",
      status: 200,
      exercise_results: result,
    });
  });
};

const getExerciseByIntensity = (req: Request, res: Response) => {
  const ExerciseIntensity = req.params.ExerciseIntensity.split(":")[1];

  const validate_fields = exercise_intensity.validate({
    ExerciseIntensity,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "SELECT * FROM tbl_exercises WHERE `ExerciseEquipment` = 'body only' AND `ExerciseIntensity` = ?";

  connection.query(query, [ExerciseIntensity], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All exercises by intensity successfully display!",
      status: 200,
      exercise_results: result,
    });
  });
};

const getExerciseByCategory = (req: Request, res: Response) => {
  const ExerciseCategory = req.params.ExerciseCategory.split(":")[1];

  const validate_fields = exercise_category.validate({
    ExerciseCategory,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "SELECT * FROM tbl_exercises WHERE `ExerciseEquipment` = 'body only' AND `ExerciseCategory` = ?";

  connection.query(query, [ExerciseCategory], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All exercises by category successfully display!",
      status: 200,
      exercise_results: result,
    });
  });
};

const getAllExercises = (req: Request, res: Response) => {
  const query =
    "SELECT * FROM tbl_exercises WHERE `ExerciseEquipment` = 'body only';";

  connection.query(query, (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All exercises successfully display!",
      status: 200,
      exercise_results: result,
    });
  });
};

const getAllExerciseTutorial = (req: Request, res: Response) => {
  const ExerciseID = req.params.ExerciseID.split(":")[1];

  const validate_fields = exercise_tutorials.validate({
    ExerciseID,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }
  const query = "SELECT * FROM tbl_exercises_tutorials WHERE `ExerciseID` = ?";

  connection.query(query, [ExerciseID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All exercise tutorial successfully display!",
      status: 200,
      exercise_results: result,
    });
  });
};

export {
  getAllExercises,
  getAllExerciseTutorial,
  getExerciseByTargetMuscle,
  getExerciseByCategory,
  getExerciseByIntensity,
};
