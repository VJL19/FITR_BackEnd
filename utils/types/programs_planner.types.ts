import IUser from "./user.types";

interface IProgram extends IUser {
  ProgramID: number;
  ProgramTitle: string;
  ProgramDescription: string;
  ProgramEntryDate: string;
}

export default IProgram;
