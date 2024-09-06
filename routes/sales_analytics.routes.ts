import express from "express";
import {
  getWeeklySalesController,
  getMonthlySalesController,
  getYearlySalesController,
  insertSubscriptionSalesController,
  getDailySessionUserSalesController,
  insertSubscriptionWithoutMController,
  getDailyMonthlyUserSalesController,
  getWeeklySessionUserSalesController,
  getWeeklyMonthlyUserSalesController,
  getMonthlySessionUserSalesController,
  getMonthlyMUserSalesController,
  getTodaySessionUserSalesController,
  getTodayMonthlyUserSalesController,
  getWeeklySessionUserGrowthRateController,
  getWeeklyMonthlyUserGrowthRateController,
  getMonthlySessionUserGrowthRateController,
  getMonthlyMUserGrowthRateController,
  getDailySessionGrowthRateController,
  getDailyMonthlyGrowthRateController,
} from "../controllers/sales_analytics.controllers";

const sales_analytics_routes = express.Router();

sales_analytics_routes.get(
  "/today_sessionUsers/sales",
  getTodaySessionUserSalesController
);
sales_analytics_routes.get(
  "/today_monthlyUsers/sales",
  getTodayMonthlyUserSalesController
);
sales_analytics_routes.get(
  "/daily_sessionUsers/sales",
  getDailySessionUserSalesController
);
sales_analytics_routes.get(
  "/daily_monthlyUsers/sales",
  getDailyMonthlyUserSalesController
);
sales_analytics_routes.get(
  "/daily_sessionUsers/growth_rate",
  getDailySessionGrowthRateController
);
sales_analytics_routes.get(
  "/daily_monthlyUsers/growth_rate",
  getDailyMonthlyGrowthRateController
);
sales_analytics_routes.get(
  "/weekly_sessionUsers/sales/:selectedMonth",
  getWeeklySessionUserSalesController
);
sales_analytics_routes.get(
  "/weekly_monthlyUsers/sales/:selectedMonth",
  getWeeklyMonthlyUserSalesController
);

sales_analytics_routes.get(
  "/weekly_sessionUsers/growth_rate/:selectedMonth",
  getWeeklySessionUserGrowthRateController
);
sales_analytics_routes.get(
  "/weekly_monthlyUsers/growth_rate/:selectedMonth",
  getWeeklyMonthlyUserGrowthRateController
);
sales_analytics_routes.get(
  "/monthly_sessionUsers/growth_rate/:selectedYear",
  getMonthlySessionUserGrowthRateController
);
sales_analytics_routes.get(
  "/monthly_mUsers/growth_rate/:selectedYear",
  getMonthlyMUserGrowthRateController
);
sales_analytics_routes.get(
  "/monthly_sessionUsers/sales/:selectedYear",
  getMonthlySessionUserSalesController
);
sales_analytics_routes.get(
  "/monthly_mUsers/sales/:selectedYear",
  getMonthlyMUserSalesController
);

sales_analytics_routes.get(
  "/weekly/sales:AnalyticsEntryDate",
  getWeeklySalesController
);
sales_analytics_routes.get(
  "/monthly/sales:AnalyticsEntryDate",
  getMonthlySalesController
);
sales_analytics_routes.get(
  "/yearly/sales:AnalyticsEntryDate",
  getYearlySalesController
);
sales_analytics_routes.post(
  "/insert_subscription/sales",
  insertSubscriptionSalesController
);
sales_analytics_routes.post(
  "/insert_subscription/sales_without_phone",
  insertSubscriptionWithoutMController
);

export default sales_analytics_routes;
