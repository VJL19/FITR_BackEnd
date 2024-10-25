import { Request, Response } from "express";
import connection from "../config/mysql";

const getDailySessionUserAttendeesController = (
  req: Request,
  res: Response
) => {
  const query = `SELECT COUNT(*) as TotalAttendees, DATE_FORMAT(SUBSTRING(DateTapped, 1, 11),"%a") AS Day, DateTapped, SubscriptionType FROM tbl_attendance WHERE TimeOut IS NOT NULL AND SubscriptionType = 'Session' AND SUBSTRING(DateTapped, 1, 11) >= CURRENT_DATE - INTERVAL 7 DAY AND SUBSTRING(DateTapped, 1, 11) < CURRENT_DATE + INTERVAL 1 DAY GROUP BY DATE_FORMAT(SUBSTRING(DateTapped, 1, 11),"%a") ORDER BY SUBSTRING(DateTapped, 1, 11) DESC;`;

  connection.query(query, (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Daily session attendees records is successfuly display!",
      status: 200,
      result: result,
    });
  });
};
const getDailyMonthlyUserAttendeesController = (
  req: Request,
  res: Response
) => {
  const query = `SELECT COUNT(*) as TotalAttendees, DATE_FORMAT(SUBSTRING(DateTapped, 1, 11),"%a") AS Day, DateTapped, SubscriptionType FROM tbl_attendance WHERE TimeOut IS NOT NULL AND SubscriptionType = 'Monthly' AND SUBSTRING(DateTapped, 1, 11) >= CURRENT_DATE - INTERVAL 7 DAY AND SUBSTRING(DateTapped, 1, 11) < CURRENT_DATE + INTERVAL 1 DAY GROUP BY DATE_FORMAT(SUBSTRING(DateTapped, 1, 11),"%a") ORDER BY SUBSTRING(DateTapped, 1, 11) DESC;`;

  connection.query(query, (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Daily monthly attendees records is successfuly display!",
      status: 200,
      result: result,
    });
  });
};
const getWeeklySessionUserAttendeesController = (
  req: Request,
  res: Response
) => {
  const selectedMonth = req.params.selectedMonth.split(":")[1];
  const query = `SET @FormatDate = date_format(str_to_date(?,'%M %d %Y'),'%c');
  SET @StartDate = DATE_SUB(DATE(CONCAT("2024-",@formatDate, "-01")),INTERVAL (DAY(DATE(CONCAT("2024-",@formatDate, "-01")))-1) DAY);
  SET @EndDate = LAST_DAY(DATE_ADD(CONCAT("2024-",@formatDate, "-01"), INTERVAL - 0 MONTH));
  SELECT COUNT(*) as TotalAttendees, DATE_FORMAT(SUBSTRING(DateTapped, 1, 11),"%a") AS Day, DateTapped, SubscriptionType, concat('Week ',week(SUBSTRING(DateTapped, 1, 11))) as 'Week' from tbl_attendance where (SUBSTRING(DateTapped, 1, 11) >= @StartDate and SUBSTRING(DateTapped, 1, 11) <= @EndDate) AND SubscriptionType = 'Session' AND TimeOut IS NOT NULL AND DATE_FORMAT(SUBSTRING(DateTapped, 1, 11), "%M") = ? group by week(SUBSTRING(DateTapped, 1, 11));`;

  connection.query(query, [selectedMonth, selectedMonth], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Weekly session attendees records is successfuly display!",
      status: 200,
      result: result[3],
    });
  });
};
const getWeeklyMonthlyUserAttendeesController = (
  req: Request,
  res: Response
) => {
  const selectedMonth = req.params.selectedMonth.split(":")[1];
  const query = `SET @FormatDate = date_format(str_to_date(?,'%M %d %Y'),'%c');
  SET @StartDate = DATE_SUB(DATE(CONCAT("2024-",@formatDate, "-01")),INTERVAL (DAY(DATE(CONCAT("2024-",@formatDate, "-01")))-1) DAY);
  SET @EndDate = LAST_DAY(DATE_ADD(CONCAT("2024-",@formatDate, "-01"), INTERVAL - 0 MONTH));
  SELECT COUNT(*) as TotalAttendees, DATE_FORMAT(SUBSTRING(DateTapped, 1, 11),"%a") AS Day, DateTapped, SubscriptionType, concat('Week ',week(SUBSTRING(DateTapped, 1, 11))) as 'Week' from tbl_attendance where (SUBSTRING(DateTapped, 1, 11) >= @StartDate and SUBSTRING(DateTapped, 1, 11) <= @EndDate) AND SubscriptionType = 'Monthly' AND TimeOut IS NOT NULL AND DATE_FORMAT(SUBSTRING(DateTapped, 1, 11), "%M") = ? group by week(SUBSTRING(DateTapped, 1, 11));`;

  connection.query(query, [selectedMonth, selectedMonth], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Weekly monthly attendees records is successfuly display!",
      status: 200,
      result: result[3],
    });
  });
};
const getMonthlySessionUserAttendeesController = (
  req: Request,
  res: Response
) => {
  const selectedYear = req.params.selectedYear.split(":")[1];
  const query = `SELECT SubscriptionType, DATE_FORMAT(SUBSTRING(DateTapped, 1, 11), "%M") as 'Months', DateTapped, COUNT(*) AS TotalAttendees FROM tbl_attendance WHERE SubscriptionType = 'Session' AND TimeOut IS NOT NULL AND Year(SUBSTRING(DateTapped, 1, 11)) = ? GROUP BY YEAR(SUBSTRING(DateTapped, 1, 11)), MONTH(SUBSTRING(DateTapped, 1, 11));`;

  connection.query(query, [selectedYear], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Session user attendees records is successfuly display!",
      status: 200,
      result: result,
    });
  });
};
const getMonthlyMUserAttendeesController = (req: Request, res: Response) => {
  const selectedYear = req.params.selectedYear.split(":")[1];
  const query = `SELECT SubscriptionType, DATE_FORMAT(SUBSTRING(DateTapped, 1, 11), "%M") as 'Months', DateTapped, COUNT(*) AS TotalAttendees FROM tbl_attendance WHERE SubscriptionType = 'Monthly' AND TimeOut IS NOT NULL AND Year(SUBSTRING(DateTapped, 1, 11)) = ? GROUP BY YEAR(SUBSTRING(DateTapped, 1, 11)), MONTH(SUBSTRING(DateTapped, 1, 11));`;

  connection.query(query, [selectedYear], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Monthly m user attendees records is successfuly display!",
      status: 200,
      result: result,
    });
  });
};

export {
  getDailySessionUserAttendeesController,
  getDailyMonthlyUserAttendeesController,
  getWeeklySessionUserAttendeesController,
  getWeeklyMonthlyUserAttendeesController,
  getMonthlySessionUserAttendeesController,
  getMonthlyMUserAttendeesController,
};
