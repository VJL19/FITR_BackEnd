interface IGymEquipmentTutorial {
  GymEquipmentID: number;
  GymEquipmentName: string;
  GymEquipmentTutorialID: number;
  GymEquipmentTutorialTitle: string;
  GymEquipmentTutorialThumbnail: string;
  GymEquipmentTutorialLink: string;
}

interface IGymEquipment {
  GymEquipmentID: number;
  GymEquipmentImage: string;
  GymEquipmentName: string;
  GymEquipmentDescription: string;
  GymEquipmentIntensity: string;
  GymEquipmentTargetMuscle: string;
  GymEquipmentCategory: string;
  GymEquipmentTutorialVideos: IGymEquipmentTutorial[];
}

export default IGymEquipment;
