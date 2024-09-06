import ISalesAnalytics from "./sales_analytics.types";
import IUser from "./user.types";

interface ISubscriptions extends IUser {
  SubscriptionID: number;
  SubscriptionAmount: number;
  SubscriptionBy: string;
  SubscriptionType: string;
  SubscriptionMethod: string;
  SubscriptionStatus: string;
  SubscriptionUploadedImage: string;
  SubscriptionEntryDate: string;
  No_M_SubscriptionID: number;
}
export default ISubscriptions;
