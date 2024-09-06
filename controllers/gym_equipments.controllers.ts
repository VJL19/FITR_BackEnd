import { Request, Response, response } from "express";
import connection from "../config/mysql";
import IGymEquipment from "../utils/types/gym_equipments.types";
import {
  gym_equipment_category,
  gym_equipment_intensity,
  gym_equipment_target_muscle,
  gym_equipment_tutorials,
} from "../utils/validations/gym_equipment.validations";

const getGymEquipmentByTargetMuscle = (req: Request, res: Response) => {
  const GymEquipmentTargetMuscle =
    req.params.GymEquipmentTargetMuscle.split(":")[1];

  const validate_fields = gym_equipment_target_muscle.validate({
    GymEquipmentTargetMuscle,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "SELECT * FROM tbl_gym_equipments WHERE `GymEquipmentTargetMuscle` = ?";

  connection.query(query, [GymEquipmentTargetMuscle], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });
    return res.status(200).json({
      message: "All gym equipments by target muscle successfully display!",
      status: 200,
      gym_results: result,
    });
  });
};

const getGymEquipmentByIntensity = (req: Request, res: Response) => {
  const GymEquipmentIntensity = req.params.GymEquipmentIntensity.split(":")[1];

  const validate_fields = gym_equipment_intensity.validate({
    GymEquipmentIntensity,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }

  const query =
    "SELECT * FROM tbl_gym_equipments WHERE `GymEquipmentIntensity` = ?";

  connection.query(query, [GymEquipmentIntensity], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All gym equipments by intensity successfully display!",
      status: 200,
      gym_results: result,
    });
  });
};

const getGymEquipmentByCategory = (req: Request, res: Response) => {
  const GymEquipmentCategory = req.params.GymEquipmentCategory.split(":")[1];

  const validate_fields = gym_equipment_category.validate({
    GymEquipmentCategory,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "SELECT * FROM tbl_gym_equipments WHERE `GymEquipmentCategory` = ?";

  connection.query(query, [GymEquipmentCategory], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All gym equipments by category successfully display!",
      status: 200,
      gym_results: result,
    });
  });
};

const getAllGymEquipments = (req: Request, res: Response) => {
  const query = "SELECT * FROM tbl_gym_equipments";

  connection.query(query, (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All gym equipments successfully display!",
      status: 200,
      gym_results: result,
    });
  });
};

const getAllGymEquipmentsTutorial = (req: Request, res: Response) => {
  const GymEquipmentID = req.params.GymEquipmentID.split(":")[1];

  const validate_fields = gym_equipment_tutorials.validate({
    GymEquipmentID,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "SELECT * FROM tbl_gym_equipments_tutorials WHERE `GymEquipmentID` = ?";

  connection.query(query, [GymEquipmentID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All gym equipments tutorial successfully display!",
      status: 200,
      gym_results: result,
    });
  });
};
export {
  getAllGymEquipments,
  getAllGymEquipmentsTutorial,
  getGymEquipmentByCategory,
  getGymEquipmentByIntensity,
  getGymEquipmentByTargetMuscle,
};
