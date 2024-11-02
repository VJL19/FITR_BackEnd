import { Request, Response } from "express";
import connection from "../config/mysql";
import IGenerateReport from "../utils/types/generate_report.types";

//attendance reports controllers.
const getAttendanceSpecificDate = (req: Request, res: Response) => {
  const { startDate, endDate } = req.body;
  //format date here to = "YYYY--MM--DD hh:mm:ss";

  const query =
    "SELECT * FROM tbl_attendance WHERE DATE(`DateTapped`) BETWEEN DATE(?) AND DATE(?) ORDER BY DateTapped ASC;";
  connection.query(query, [startDate, endDate], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Successfully display all the attendance on specific date!",
      status: 200,
      result: result,
    });
  });
};
const getTotalMonthlyUsersAttendanceBySpecificDate = (
  req: Request,
  res: Response
) => {
  const selectedDate = req.params.selectedDate.split(":")[1];

  //format date here to = "YYYY--MM--DD hh:mm:ss";

  const query =
    "SELECT COUNT(*) as TotalMonthlyUsers FROM tbl_attendance WHERE DATE(`DateTapped`) = DATE(?) AND SubscriptionType = 'Monthly';";

  connection.query(query, [selectedDate], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message:
        "Successfully display all monthly users attendance on specific date!",
      status: 200,
      result: result,
    });
  });
};
const getTotalSessionUsersAttendanceBySpecificDate = (
  req: Request,
  res: Response
) => {
  const selectedDate = req.params.selectedDate.split(":")[1];

  //format date here to = "YYYY--MM--DD hh:mm:ss";

  const query =
    "SELECT COUNT(*) as TotalSessionUsers FROM tbl_attendance WHERE DATE(`DateTapped`) = DATE(?) AND SubscriptionType = 'Session';";

  connection.query(query, [selectedDate], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message:
        "Successfully display all session users attendance on specific date!",
      status: 200,
      result: result,
    });
  });
};
const getTotalUsersAttendanceBySpecificDate = (req: Request, res: Response) => {
  const selectedDate = req.params.selectedDate.split(":")[1];

  //format date here to = "YYYY--MM--DD hh:mm:ss";

  const query =
    "SELECT COUNT(DISTINCT(UserID)) as TotalUsers FROM tbl_attendance WHERE DATE(`DateTapped`) = DATE(?);";

  connection.query(query, [selectedDate], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Successfully display all users attendance on specific date!",
      status: 200,
      result: result,
    });
  });
};

const getAttendanceSpecificMonth = (req: Request, res: Response) => {
  const selectedMonth = req.params.selectedMonth.split(":")[1];

  //format date here to = "YYYY--MM--DD hh:mm:ss";

  const query =
    "SELECT * FROM tbl_attendance WHERE MONTH(`DateTapped`) = MONTH('?');";
  connection.query(query, [selectedMonth], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Successfully display all the attendance on specific date!",
      status: 200,
      result: result,
    });
  });
};

const getAttendanceWeeklyByRange = (req: Request, res: Response) => {
  const { selectedFirstDate, selectedSecondDate } = <IGenerateReport>req.body;

  //format date here to = "YYYY--MM--DD hh:mm:ss";

  const query =
    "SELECT * FROM tbl_attendance WHERE DATE(`DateTapped`) BETWEEN 'selectedFirstDate' AND 'selectedSecondDate'";

  connection.query(
    query,
    [selectedFirstDate, selectedSecondDate],
    (error, result) => {
      if (error) return res.status(400).json({ error: error, status: 400 });

      return res.status(200).json({
        message: "Successfully display all the attendance on week range",
        status: 200,
        result: result,
      });
    }
  );
};

const getAttendanceWithinYear = (req: Request, res: Response) => {
  const selectedYear = req.params.DateScanned;

  //format date here to = "YYYY--MM--DD hh:mm:ss";

  const query =
    "SELECT * FROM tbl_attendance WHERE YEAR(`DateTapped`) = YEAR('selectedYear')";

  connection.query(query, [selectedYear], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Successfully display all the attendance within the year",
      status: 200,
      result: result,
    });
  });
};

//financial reports for daily, weekly, and monthly sales using mobile phone.

const getSalesSpecificDate = (req: Request, res: Response) => {
  const selectedDate = req.params.DateScanned;

  //format date here to = "YYYY--MM--DD hh:mm:ss";

  const query =
    "SELECT * FROM tbl_subscriptions WHERE DATE(`SubscriptionEntryDate`) = 'selectedDate'";

  connection.query(query, [selectedDate], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Successfully display all the sales on specific date!",
      status: 200,
      result: result,
    });
  });
};

const getSalesSpecificMonth = (req: Request, res: Response) => {
  const selectedMonth = req.params.DateScanned;

  //format date here to = "YYYY--MM--DD hh:mm:ss";

  const query =
    "SELECT * FROM tbl_subscriptions WHERE MONTH(`SubscriptionEntryDate`) = MONTH('selectedMonth');";
  connection.query(query, [selectedMonth], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Successfully display all the sales on specific month!",
      status: 200,
      result: result,
    });
  });
};

const getSalesWeeklyByRange = (req: Request, res: Response) => {
  const { selectedFirstDate, selectedSecondDate } = <IGenerateReport>req.body;

  //format date here to = "YYYY--MM--DD hh:mm:ss";

  const query =
    "SELECT * FROM tbl_subscriptions WHERE DATE(`SubscriptionEntryDate`) BETWEEN 'selectedFirstDate' AND 'selectedSecondDate'";

  connection.query(
    query,
    [selectedFirstDate, selectedSecondDate],
    (error, result) => {
      if (error) return res.status(400).json({ error: error, status: 400 });

      return res.status(200).json({
        message: "Successfully display all the sales on custom week range",
        status: 200,
        result: result,
      });
    }
  );
};

const getSalesWithinYear = (req: Request, res: Response) => {
  const selectedYear = req.params.DateScanned;

  //format date here to = "YYYY--MM--DD hh:mm:ss";

  const query =
    "SELECT * FROM tbl_subscriptions WHERE YEAR(`SubscriptionEntryDate`) = YEAR('selectedYear')";

  connection.query(query, [selectedYear], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Successfully display all the sales within the year",
      status: 200,
      result: result,
    });
  });
};

export {
  getAttendanceSpecificDate,
  getTotalUsersAttendanceBySpecificDate,
  getTotalSessionUsersAttendanceBySpecificDate,
  getTotalMonthlyUsersAttendanceBySpecificDate,
  getAttendanceWeeklyByRange,
  getAttendanceSpecificMonth,
  getAttendanceWithinYear,
  getSalesSpecificDate,
  getSalesSpecificMonth,
  getSalesWeeklyByRange,
  getSalesWithinYear,
};
