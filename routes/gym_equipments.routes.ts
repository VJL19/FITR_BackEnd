import express from "express";

import {
  getAllGymEquipments,
  getGymEquipmentByIntensity,
  getGymEquipmentByTargetMuscle,
  getGymEquipmentByCategory,
  getAllGymEquipmentsTutorial,
} from "../controllers/gym_equipments.controllers";
import verifyAuthToken from "../middlewares/verifyToken";

const gym_equipment_routes = express.Router();

gym_equipment_routes.get(
  "/all_equipments",
  verifyAuthToken,
  getAllGymEquipments
);
gym_equipment_routes.get(
  "/target_muscle:GymEquipmentTargetMuscle",
  verifyAuthToken,
  getGymEquipmentByTargetMuscle
);
gym_equipment_routes.get(
  "/intensity:GymEquipmentIntensity",
  verifyAuthToken,
  getGymEquipmentByIntensity
);
gym_equipment_routes.get(
  "/category:GymEquipmentCategory",
  verifyAuthToken,
  getGymEquipmentByCategory
);
gym_equipment_routes.get(
  "/tutorials:GymEquipmentID",
  verifyAuthToken,
  getAllGymEquipmentsTutorial
);

export default gym_equipment_routes;
