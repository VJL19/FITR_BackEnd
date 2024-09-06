import Joi from "joi";
import IGymEquipment from "../types/gym_equipments.types";

const gym_equipment_target_muscle = Joi.object<IGymEquipment>({
  GymEquipmentTargetMuscle: Joi.string().required(),
});
const gym_equipment_intensity = Joi.object<IGymEquipment>({
  GymEquipmentIntensity: Joi.string().required(),
});
const gym_equipment_category = Joi.object<IGymEquipment>({
  GymEquipmentCategory: Joi.string().required(),
});
const gym_equipment_tutorials = Joi.object<IGymEquipment>({
  GymEquipmentID: Joi.number().required(),
});

export {
  gym_equipment_target_muscle,
  gym_equipment_intensity,
  gym_equipment_category,
  gym_equipment_tutorials,
};
