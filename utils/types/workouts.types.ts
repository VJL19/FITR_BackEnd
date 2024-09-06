interface IWorkOutTutorials {
  WorkOutID: number;
  WorkOutName: string;
  WorkOutTutorialID: number;
  WorkOutTutorialTitle: string;
  WorkOutTutorialThumbnail: string;
  WorkOutTutorialLink: string;
}

interface IWorkouts {
  WorkOutID: number;
  WorkOutImage: string;
  WorkOutName: string;
  WorkOutSets: string;
  WorkOutReps: string;
  WorkOutExplanation: string;
  WorkOutIntensity: string;
  WorkOutTargetMuscle: string;
  WorkOutCategory: string;
  WorkOutTutorialVideos: IWorkOutTutorials[];
}

export default IWorkouts;
