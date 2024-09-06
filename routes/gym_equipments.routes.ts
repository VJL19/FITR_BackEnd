import express from "express";

import {
  getAllGymEquipments,
  getGymEquipmentByIntensity,
  getGymEquipmentByTargetMuscle,
  getGymEquipmentByCategory,
  getAllGymEquipmentsTutorial,
} from "../controllers/gym_equipments.controllers";

const gym_equipment_routes = express.Router();

gym_equipment_routes.get("/all_equipments", getAllGymEquipments);
gym_equipment_routes.get(
  "/target_muscle:GymEquipmentTargetMuscle",
  getGymEquipmentByTargetMuscle
);
gym_equipment_routes.get(
  "/intensity:GymEquipmentIntensity",
  getGymEquipmentByIntensity
);
gym_equipment_routes.get(
  "/category:GymEquipmentCategory",
  getGymEquipmentByCategory
);
gym_equipment_routes.get(
  "/tutorials:GymEquipmentID",
  getAllGymEquipmentsTutorial
);

export default gym_equipment_routes;
