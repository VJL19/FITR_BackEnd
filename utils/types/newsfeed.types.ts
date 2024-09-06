import ICommments from "./comment.types";
import { IUsersComment } from "./post.types";
import IUser from "./user.types";

interface INewsFeed extends IUser, ICommments {
  PostID: number;
  NewsfeedID: number;
  PostImage: string;
  PostLikes: number;
  PostTitle: string;
  PostAuthor: string;
  PostDate: string;
  PostIsLike: boolean;
  PostComments: IUsersComment[];
  SubscriptionType: string;
}

export default INewsFeed;
