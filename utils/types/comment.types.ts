import { IPost } from "./post.types";
import IUser from "./user.types";

interface ICommments extends IUser, IPost {
  CommentID: number;
  CommentText: string;
  NewsfeedID: number;
  CommentDate: string;
}

export default ICommments;
