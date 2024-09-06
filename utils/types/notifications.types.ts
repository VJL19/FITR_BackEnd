import INewsFeed from "./newsfeed.types";
import IUser from "./user.types";

interface INotifications extends INewsFeed, IUser {
  NotificationID: number;
  NotificationAuthor: string;
  NotificationText: string;
  NotificationDate: string;
  NotifUserID: number;
}

export default INotifications;
