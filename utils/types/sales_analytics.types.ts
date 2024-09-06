import ISubscriptions from "./subscription.types";

interface ISalesAnalytics extends ISubscriptions {
  AnalyticsID: number;
  AnalyticsAmount: number;
  AnalyticsEntryDate: string;
}

export interface IDailySalesAnalytics {
  Day: string;
  SubscriptionEntryDate: string;
  TotalSales: string;
}

export default ISalesAnalytics;
