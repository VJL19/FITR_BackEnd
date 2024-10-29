import { Request, Response } from "express";
import connection from "../config/mysql";
import ISubscriptions from "../utils/types/subscription.types";
import ISalesAnalytics from "../utils/types/sales_analytics.types";
import {
  sales_field_validator,
  create_subscription_using_mphone_validator,
  create_subscription_without_mphone_validator,
  dailySalesValidator,
} from "../utils/validations/sales_analytics.validations";

const getMonthlySessionUserSalesController = (req: Request, res: Response) => {
  const selectedYear = req.params.selectedYear.split(":")[1];
  const query = `SELECT SubscriptionType, DATE_FORMAT(SubscriptionEntryDate, "%M") as 'Months', ROUND(SUM(COALESCE(SubscriptionAmount, 0)), 2) AS 'TotalSalesPerMonth' FROM tbl_subscriptions WHERE SubscriptionType = 'Session' AND SubscriptionStatus = 'Fulfill' AND Year(SubscriptionEntryDate) = ? GROUP BY YEAR(SubscriptionEntryDate), MONTH(SubscriptionEntryDate);`;

  connection.query(query, [selectedYear], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Monthly session sales records is successfuly display!",
      status: 200,
      result: result,
    });
  });
};
const getMonthlyMUserSalesController = (req: Request, res: Response) => {
  const selectedYear = req.params.selectedYear.split(":")[1];
  const query = `SELECT SubscriptionType, DATE_FORMAT(SubscriptionEntryDate, "%M") as 'Months', ROUND(SUM(COALESCE(SubscriptionAmount, 0)), 2) AS 'TotalSalesPerMonth' FROM tbl_subscriptions WHERE SubscriptionType = 'Monthly' AND SubscriptionStatus = 'Fulfill' AND Year(SubscriptionEntryDate) = ? GROUP BY YEAR(SubscriptionEntryDate), MONTH(SubscriptionEntryDate);`;

  connection.query(query, [selectedYear], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Monthly m users sales records is successfuly display!",
      status: 200,
      result: result,
    });
  });
};
const getMonthlySessionUserGrowthRateController = (
  req: Request,
  res: Response
) => {
  const selectedYear = req.params.selectedYear.split(":")[1];
  const query = `select SubscriptionType, DATE_FORMAT(SubscriptionEntryDate, "%M") as 'Months', TotalSalesPerMonth,
  if(@last_entry = 0, 0, round(((TotalSalesPerMonth - @last_entry) / @last_entry) * 100,2)) "GrowthRate",
  @last_entry := TotalSalesPerMonth
  from
  (select @last_entry := 0) x,
  (SELECT SubscriptionAmount, SubscriptionType, SubscriptionEntryDate, ROUND(SUM(COALESCE(SubscriptionAmount, 0)), 2) AS 'TotalSalesPerMonth' FROM tbl_subscriptions WHERE SubscriptionType = 'Session' AND SubscriptionStatus = 'Fulfill' AND Year(SubscriptionEntryDate) = ? GROUP BY YEAR(SubscriptionEntryDate), MONTH(SubscriptionEntryDate)) y`;

  connection.query(query, [selectedYear], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Monthly session users growth rate is successfuly display!",
      status: 200,
      result: result,
    });
  });
};
const getMonthlyMUserGrowthRateController = (req: Request, res: Response) => {
  const selectedYear = req.params.selectedYear.split(":")[1];
  const query = `select SubscriptionType, DATE_FORMAT(SubscriptionEntryDate, "%M") as 'Months', TotalSalesPerMonth,
  if(@last_entry = 0, 0, round(((TotalSalesPerMonth - @last_entry) / @last_entry) * 100,2)) "GrowthRate",
  @last_entry := TotalSalesPerMonth
  from
  (select @last_entry := 0) x,
  (SELECT SubscriptionAmount, SubscriptionType, SubscriptionEntryDate, ROUND(SUM(COALESCE(SubscriptionAmount, 0)), 2) AS 'TotalSalesPerMonth' FROM tbl_subscriptions WHERE SubscriptionType = 'Monthly' AND SubscriptionStatus = 'Fulfill' AND Year(SubscriptionEntryDate) = ? GROUP BY YEAR(SubscriptionEntryDate), MONTH(SubscriptionEntryDate)) y`;

  connection.query(query, [selectedYear], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Monthly m users growth rate is successfuly display!",
      status: 200,
      result: result,
    });
  });
};
const getWeeklySessionUserSalesController = (req: Request, res: Response) => {
  const selectedMonth = req.params.selectedMonth.split(":")[1];
  const query = `SET @FormatDate = date_format(str_to_date('${selectedMonth}/1/2024','%M/%d/%Y'),'%c');

  SET @StartDate = DATE_SUB(DATE(CONCAT("2024-",@formatDate, "-01")),INTERVAL (DAY(DATE(CONCAT("2024-",@formatDate, "-01")))-1) DAY);
  SET @EndDate = LAST_DAY(DATE_ADD(CONCAT("2024-",@formatDate, "-01"), INTERVAL - 0 MONTH));
  SELECT SubscriptionType, concat('Week ',week(SubscriptionEntryDate)) as 'Week', ROUND(sum(SubscriptionAmount), 2) as 'TotalSalesPerWeek' from tbl_subscriptions where (SubscriptionEntryDate >= @StartDate and SubscriptionEntryDate <= @EndDate) AND SubscriptionType = 'Session' AND SubscriptionStatus = 'Fulfill' AND DATE_FORMAT(SubscriptionEntryDate, "%M") = ? group by week(SubscriptionEntryDate);`;

  connection.query(query, [selectedMonth, selectedMonth], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Weekly session sales records is successfuly display!",
      status: 200,
      result: result[3],
    });
  });
};
const getWeeklyMonthlyUserSalesController = (req: Request, res: Response) => {
  const selectedMonth = req.params.selectedMonth.split(":")[1];
  const query = `SET @FormatDate = date_format(str_to_date('${selectedMonth}/1/2024','%M/%d/%Y'),'%c');

  SET @StartDate = DATE_SUB(DATE(CONCAT("2024-",@formatDate, "-01")),INTERVAL (DAY(DATE(CONCAT("2024-",@formatDate, "-01")))-1) DAY);
  SET @EndDate = LAST_DAY(DATE_ADD(CONCAT("2024-",@formatDate, "-01"), INTERVAL - 0 MONTH));
  SELECT SubscriptionType, concat('Week ',week(SubscriptionEntryDate)) as 'Week', ROUND(sum(SubscriptionAmount), 2) as 'TotalSalesPerWeek' from tbl_subscriptions where (SubscriptionEntryDate >= @StartDate and SubscriptionEntryDate <= @EndDate) AND SubscriptionType = 'Monthly' AND SubscriptionStatus = 'Fulfill' AND DATE_FORMAT(SubscriptionEntryDate, "%M") = ? group by week(SubscriptionEntryDate);`;

  connection.query(query, [selectedMonth, selectedMonth], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Weekly monthly sales records is successfuly display!",
      status: 200,
      result: result[3],
    });
  });
};
const getWeeklyMonthlyUserGrowthRateController = (
  req: Request,
  res: Response
) => {
  const selectedMonth = req.params.selectedMonth.split(":")[1];
  const query = `SET @FormatDate = date_format(str_to_date(?,'%M'),'%c');
  SET @StartDate = DATE_SUB(DATE(CONCAT("2024-",@formatDate, "-01")),INTERVAL (DAY(DATE(CONCAT("2024-",@formatDate, "-01")))-1) DAY);
  SET @EndDate = LAST_DAY(DATE_ADD(CONCAT("2024-",@formatDate, "-01"), INTERVAL - 0 MONTH));
  
  select SubscriptionType,concat('Week ',week(SubscriptionEntryDate)) as 'Week', TotalSalesPerWeek,
      if(@last_entry = 0, 0, round(((TotalSalesPerWeek - @last_entry) / @last_entry) * 100,2)) "GrowthRate",
      @last_entry := TotalSalesPerWeek
      from
      (select @last_entry := 0) x,
      (SELECT SubscriptionType, SubscriptionEntryDate, concat('Week ',week(SubscriptionEntryDate)) as 'Week', ROUND(sum(SubscriptionAmount), 2) as 'TotalSalesPerWeek' from tbl_subscriptions where (SubscriptionEntryDate >= @StartDate and SubscriptionEntryDate <= @EndDate) AND SubscriptionType = 'Monthly' AND SubscriptionStatus = 'Fulfill' AND DATE_FORMAT(SubscriptionEntryDate, "%M") = ? group by week(SubscriptionEntryDate)) y`;

  connection.query(query, [selectedMonth, selectedMonth], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message:
        "Weekly monthly users growth rate records is successfuly display!",
      status: 200,
      result: result[3],
    });
  });
};
const getWeeklySessionUserGrowthRateController = (
  req: Request,
  res: Response
) => {
  const selectedMonth = req.params.selectedMonth.split(":")[1];
  const query = `SET @FormatDate = date_format(str_to_date(?,'%M'),'%c');
  SET @StartDate = DATE_SUB(DATE(CONCAT("2024-",@formatDate, "-01")),INTERVAL (DAY(DATE(CONCAT("2024-",@formatDate, "-01")))-1) DAY);
  SET @EndDate = LAST_DAY(DATE_ADD(CONCAT("2024-",@formatDate, "-01"), INTERVAL - 0 MONTH));
  
  select SubscriptionType,concat('Week ',week(SubscriptionEntryDate)) as 'Week', TotalSalesPerWeek,
      if(@last_entry = 0, 0, round(((TotalSalesPerWeek - @last_entry) / @last_entry) * 100,2)) "GrowthRate",
      @last_entry := TotalSalesPerWeek
      from
      (select @last_entry := 0) x,
      (SELECT SubscriptionType, SubscriptionEntryDate, concat('Week ',week(SubscriptionEntryDate)) as 'Week', ROUND(sum(SubscriptionAmount), 2) as 'TotalSalesPerWeek' from tbl_subscriptions where (SubscriptionEntryDate >= @StartDate and SubscriptionEntryDate <= @EndDate) AND SubscriptionType = 'Session' AND SubscriptionStatus = 'Fulfill' AND DATE_FORMAT(SubscriptionEntryDate, "%M") = ? group by week(SubscriptionEntryDate)) y`;

  connection.query(query, [selectedMonth, selectedMonth], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message:
        "Weekly session users growth rate records is successfuly display!",
      status: 200,
      result: result[3],
    });
  });
};

const getDailySessionUserSalesController = (req: Request, res: Response) => {
  const query = `SELECT SubscriptionType, DATE_FORMAT(SubscriptionEntryDate,"%a") AS Day, SubscriptionEntryDate, ROUND(sum(coalesce(SubscriptionAmount, 0)), 2) as TotalSales from tbl_subscriptions where SubscriptionType = 'Session' AND SubscriptionStatus = 'Fulfill' AND SubscriptionEntryDate >= CURRENT_DATE - INTERVAL 7 DAY AND SubscriptionEntryDate < CURRENT_DATE + INTERVAL 1 DAY group by DATE_FORMAT(SubscriptionEntryDate,"%a") ORDER BY SubscriptionEntryDate DESC;`;

  connection.query(query, (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Daily session sales records is successfuly display!",
      status: 200,
      result: result,
    });
  });
};
const getDailyMonthlyUserSalesController = (req: Request, res: Response) => {
  const query = `SELECT SubscriptionType, DATE_FORMAT(SubscriptionEntryDate,"%a") AS Day, SubscriptionEntryDate, ROUND(sum(coalesce(SubscriptionAmount, 0)), 2) as TotalSales from tbl_subscriptions where SubscriptionType = 'Monthly' AND SubscriptionStatus = 'Fulfill' AND SubscriptionEntryDate >= CURRENT_DATE - INTERVAL 7 DAY AND SubscriptionEntryDate < CURRENT_DATE + INTERVAL 1 DAY group by DATE_FORMAT(SubscriptionEntryDate,"%a") ORDER BY SubscriptionEntryDate DESC;`;

  connection.query(query, (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Daily monthly users sales records is successfuly display!",
      status: 200,
      result: result,
    });
  });
};
const getDailySessionGrowthRateController = (req: Request, res: Response) => {
  const query = `select SubscriptionType, SubscriptionEntryDate, DATE_FORMAT(SubscriptionEntryDate,"%a") AS Day, TotalSales,
  if(@last_entry = 0, 0, round(((TotalSales - @last_entry) / @last_entry) * 100,2)) "GrowthRate",
  @last_entry := TotalSales
  from
   (select @last_entry := 0) x,
   (SELECT SubscriptionType, SubscriptionEntryDate, DATE_FORMAT(SubscriptionEntryDate,"%a") AS Day, ROUND(sum(coalesce(SubscriptionAmount, 0)), 2) as TotalSales from tbl_subscriptions where SubscriptionType = 'Session' AND SubscriptionStatus = 'Fulfill' AND SubscriptionEntryDate >= CURRENT_DATE - INTERVAL 7 DAY AND SubscriptionEntryDate < CURRENT_DATE + INTERVAL 1 DAY group by DATE_FORMAT(SubscriptionEntryDate,"%a") ORDER BY SubscriptionEntryDate DESC) y;`;

  connection.query(query, (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Daily session growth rate is successfuly display!",
      status: 200,
      result: result,
    });
  });
};
const getDailyMonthlyGrowthRateController = (req: Request, res: Response) => {
  const query = `select SubscriptionType, SubscriptionEntryDate, DATE_FORMAT(SubscriptionEntryDate,"%a") AS Day, TotalSales,
  if(@last_entry = 0, 0, round(((TotalSales - @last_entry) / @last_entry) * 100,2)) "GrowthRate",
  @last_entry := TotalSales
  from
   (select @last_entry := 0) x,
   (SELECT SubscriptionType, SubscriptionEntryDate, DATE_FORMAT(SubscriptionEntryDate,"%a") AS Day, ROUND(sum(coalesce(SubscriptionAmount, 0)), 2) as TotalSales from tbl_subscriptions where SubscriptionType = 'Monthly' AND SubscriptionStatus = 'Fulfill' AND SubscriptionEntryDate >= CURRENT_DATE - INTERVAL 7 DAY AND SubscriptionEntryDate < CURRENT_DATE + INTERVAL 1 DAY group by DATE_FORMAT(SubscriptionEntryDate,"%a") ORDER BY SubscriptionEntryDate DESC) y;`;

  connection.query(query, (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Daily monthly users growth rate is successfuly display!",
      status: 200,
      result: result,
    });
  });
};
const getTodaySessionUserSalesController = (req: Request, res: Response) => {
  const query = `select SubscriptionType, SubscriptionEntryDate, CONCAT(((hour(SubscriptionEntryDate) - 1) DIV 4 + 1), " hrs ago") as Hours , ROUND(sum(SubscriptionAmount), 2) as TotalSalesPer4Hr from tbl_subscriptions WHERE DATE(SubscriptionEntryDate) >= now() - INTERVAL 1 DAY AND SubscriptionType = 'Session' AND SubscriptionStatus = 'Fulfill' group by (hour(SubscriptionEntryDate) - 1) DIV 4 ORDER by Hours ASC;`;

  connection.query(query, (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Today session sales records is successfuly display!",
      status: 200,
      result: result,
    });
  });
};
const getTodayMonthlyUserSalesController = (req: Request, res: Response) => {
  const query = `select SubscriptionType, SubscriptionEntryDate, CONCAT(((hour(SubscriptionEntryDate) - 1) DIV 4 + 1), " hrs ago") as Hours , ROUND(sum(SubscriptionAmount), 2) as TotalSalesPer4Hr from tbl_subscriptions WHERE DATE(SubscriptionEntryDate) >= now() - INTERVAL 1 DAY AND SubscriptionType = 'Monthly' AND SubscriptionStatus = 'Fulfill' group by (hour(SubscriptionEntryDate) - 1) DIV 4 ORDER by Hours ASC;`;
  connection.query(query, (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Today monthly users sales records is successfuly display!",
      status: 200,
      result: result,
    });
  });
};
const getWeeklySalesController = (req: Request, res: Response) => {
  const AnalyticsEntryDate = req.params.AnalyticsEntryDate;

  const validate_fields = sales_field_validator.validate({
    AnalyticsEntryDate,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }
  //replace * in query with count(AnalyticsAmount)
  const query =
    "SELECT * FROM tbl_sales_analytics WHERE WEEK(`AnalyticsEntryDate`) = WEEK(NOW()) ";

  connection.query(query, [AnalyticsEntryDate], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Weekly sales records is successfuly display!",
      status: 200,
      result: result,
    });
  });
};
const getMonthlySalesController = (req: Request, res: Response) => {
  const AnalyticsEntryDate = req.params.AnalyticsEntryDate;

  const validate_fields = sales_field_validator.validate({
    AnalyticsEntryDate,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }

  //replace * in query with count(AnalyticsAmount)
  const query =
    "SELECT * FROM tbl_sales_analytics WHERE MONTH(`AnalyticsEntryDate`) = MONTH(NOW()) ";

  connection.query(query, [AnalyticsEntryDate], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Monthly sales records is successfuly display!",
      status: 200,
      result: result,
    });
  });
};

const getYearlySalesController = (req: Request, res: Response) => {
  const AnalyticsEntryDate = req.params.AnalyticsEntryDate;

  const validate_fields = sales_field_validator.validate({
    AnalyticsEntryDate,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }
  //replace * in query with count(AnalyticsAmount)
  const query =
    "SELECT * FROM tbl_sales_analytics WHERE YEAR(`AnalyticsEntryDate`) = YEAR(NOW()) ";

  connection.query(query, [AnalyticsEntryDate], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Yearly sales records is successfuly display!",
      status: 200,
      result: result,
    });
  });
};

//if the user had success transaction using mobile phone insert a new field in tbl sales.
const insertSubscriptionSalesController = (req: Request, res: Response) => {
  const { SubscriptionID, AnalyticsAmount, AnalyticsEntryDate } = <
    ISalesAnalytics
  >req.body;

  const validate_fields = create_subscription_using_mphone_validator.validate({
    SubscriptionID,
    AnalyticsAmount,
    AnalyticsEntryDate,
  });

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "INSERT INTO tbl_sales_analytics (`SubscriptionID`, `AnalyticsAmount`, `AnalyticsEntryDate` )VALUES (?) LIMIT 1;";

  const values = [SubscriptionID, AnalyticsAmount, AnalyticsEntryDate];

  connection.query(query, [values], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Subscription inserted in sales_analytics successfully!",
      status: 200,
      result: result,
    });
  });
};

//if the user had success transaction without using phone insert a new field in tbl sales.
const insertSubscriptionWithoutMController = (req: Request, res: Response) => {
  const { No_M_SubscriptionID, AnalyticsAmount, AnalyticsEntryDate } = <
    ISalesAnalytics
  >req.body;

  const validate_fields = create_subscription_without_mphone_validator.validate(
    {
      No_M_SubscriptionID,
      AnalyticsAmount,
      AnalyticsEntryDate,
    }
  );

  if (validate_fields.error) {
    return res.status(400).json({
      error: validate_fields.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "INSERT INTO tbl_sales_analytics (`No_M_SubscriptionID`, `AnalyticsAmount`, `AnalyticsEntryDate`) VALUES (?) LIMIT 1;";

  const values = [No_M_SubscriptionID, AnalyticsAmount, AnalyticsEntryDate];

  connection.query(query, [values], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message:
        "Subscription without m phone in sales_analytics inserted successfully!",
      status: 200,
      result: result,
    });
  });
};
export {
  getWeeklySessionUserGrowthRateController,
  getWeeklyMonthlyUserGrowthRateController,
  getMonthlySessionUserGrowthRateController,
  getMonthlyMUserGrowthRateController,
  getDailySessionGrowthRateController,
  getDailyMonthlyGrowthRateController,
  insertSubscriptionSalesController,
  insertSubscriptionWithoutMController,
  getWeeklySalesController,
  getMonthlySalesController,
  getYearlySalesController,
  getTodaySessionUserSalesController,
  getTodayMonthlyUserSalesController,
  getDailySessionUserSalesController,
  getDailyMonthlyUserSalesController,
  getWeeklySessionUserSalesController,
  getWeeklyMonthlyUserSalesController,
  getMonthlySessionUserSalesController,
  getMonthlyMUserSalesController,
};
