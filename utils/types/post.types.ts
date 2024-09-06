import { string } from "joi";
import IUser from "./user.types";

interface IUsersComment extends IUser {
  CommentText: string;
}

interface IPost {
  UserID: number;
  PostID: number;
  PostImage: string;
  PostLikes: number;
  PostTitle: string;
  PostDescription: string;
  PostAuthor: string;
  PostDate: string;
  PostIsLike: boolean;
  Username: string;
  PostComments: IUsersComment[];
}

export { IPost, IUsersComment };
