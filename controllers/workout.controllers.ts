import { Request, Response, response } from "express";
import connection from "../config/mysql";
import IWorkouts from "../utils/types/workouts.types";
import {
  workout_category,
  workout_intensity,
  workout_target_muscle,
  workout_tutorials,
} from "../utils/validations/workout.validations";

const getWorkOutByTargetMuscle = (req: Request, res: Response) => {
  const WorkOutTargetMuscle = req.params.WorkOutTargetMuscle.split(":")[1];

  const validate_fields = workout_target_muscle.validate({
    WorkOutTargetMuscle,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }

  if (WorkOutTargetMuscle === "All") {
    const query =
      "SELECT * FROM tbl_workouts WHERE `WorkOutEquipment` != 'body only'";

    connection.query(query, [WorkOutTargetMuscle], (error, result) => {
      if (error) return res.status(400).json({ error: error, status: 400 });

      return res.status(200).json({
        message: "All workouts by target muscle successfully display!",
        status: 200,
        workout_results: result,
      });
    });
    return;
  }

  const query =
    "SELECT * FROM tbl_workouts WHERE `WorkOutEquipment` != 'body only' AND `WorkOutTargetMuscle` = ?";

  connection.query(query, [WorkOutTargetMuscle], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });
    return res.status(200).json({
      message: "All workouts by target muscle successfully display!",
      status: 200,
      workout_results: result,
    });
  });
};

const getWorkOutByIntensity = (req: Request, res: Response) => {
  const WorkOutIntensity = req.params.WorkOutIntensity.split(":")[1];

  const validate_fields = workout_intensity.validate({
    WorkOutIntensity,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "SELECT * FROM tbl_workouts WHERE `WorkOutEquipment` != 'body only' AND `WorkOutIntensity` = ?";

  connection.query(query, [WorkOutIntensity], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All workouts by intensity successfully display!",
      status: 200,
      workout_results: result,
    });
  });
};

const getWorkOutByCategory = (req: Request, res: Response) => {
  const WorkOutCategory = req.params.WorkOutCategory.split(":")[1];

  const validate_fields = workout_category.validate({
    WorkOutCategory,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "SELECT * FROM tbl_workouts WHERE `WorkOutEquipment` != 'body only' AND `WorkOutCategory` = ?";

  connection.query(query, [WorkOutCategory], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All workouts by category is successfully display!",
      status: 200,
      workout_results: result,
    });
  });
};

const getAllWorkouts = (req: Request, res: Response) => {
  const query =
    "SELECT * FROM tbl_workouts WHERE `WorkOutEquipment` != 'body only';";

  connection.query(query, (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All workouts successfully display!",
      status: 200,
      workout_results: result,
    });
  });
};

const getAllWorkOutTutorial = (req: Request, res: Response) => {
  const WorkOutID = req.params.WorkOutID.split(":")[1];

  const validate_fields = workout_tutorials.validate({
    WorkOutID,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }
  const query = "SELECT * FROM tbl_workouts_tutorials WHERE `WorkOutID` = ?";

  connection.query(query, [WorkOutID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All workout tutorial successfully display!",
      status: 200,
      workout_results: result,
    });
  });
};

export {
  getAllWorkouts,
  getAllWorkOutTutorial,
  getWorkOutByCategory,
  getWorkOutByIntensity,
  getWorkOutByTargetMuscle,
};
