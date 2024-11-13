import { Request, Response } from "express";
import connection from "../config/mysql";
import {
  create_announcement_validator,
  edit_announcement_validator,
  delete_announcement_validator,
} from "../utils/validations/announcement_validations";
import IAnnouncements from "../utils/types/announcements.types";
import clients from "../global/socket.global";
import BadWordsNext from "bad-words-next";
const en = require("bad-words-next/data/en.json");
const fil = require("bad-words-next/data/fil.json");
const badwords = new BadWordsNext();
badwords.add(en);
badwords.add(fil);
const all_announcements = (req: Request, res: Response) => {
  const query =
    "SELECT * FROM tbl_announcements ORDER BY `AnnouncementDate` DESC;";

  connection.query(query, (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All announcements!",
      status: 200,
      result: result,
    });
  });
};

const all_today_announcements = (req: Request, res: Response) => {
  const query =
    "SELECT * FROM tbl_announcements WHERE DATE(`AnnouncementDate`) = CURDATE() ORDER BY `AnnouncementDate` DESC;";

  connection.query(query, (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All today's announcements!",
      status: 200,
      result: result,
    });
  });
};

const total_announcements = (req: Request, res: Response) => {
  const query = "SELECT COUNT(*) as TotalAnnouncements FROM tbl_announcements;";

  connection.query(query, (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All total announcements!",
      status: 200,
      result: result,
    });
  });
};

const createAnnouncement = (req: Request, res: Response) => {
  const {
    AnnouncementImage,
    AnnouncementTitle,
    AnnouncementDescription,
    AnnouncementDate,
  } = <IAnnouncements>req.body;

  const validate_announcements_fields = create_announcement_validator.validate({
    AnnouncementImage,
    AnnouncementTitle,
    AnnouncementDescription,
    AnnouncementDate,
  });

  if (validate_announcements_fields.error) {
    return res.status(400).json({
      error: validate_announcements_fields.error.details[0].message,
      status: 400,
    });
  }

  const query =
    "INSERT INTO tbl_announcements (`AnnouncementImage`, `AnnouncementTitle`, `AnnouncementDescription`, `AnnouncementDate`) VALUES (?)";

  const values = [
    AnnouncementImage,
    badwords.filter(AnnouncementTitle),
    badwords.filter(AnnouncementDescription),
    AnnouncementDate,
  ];
  connection.query(query, [values], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    for (var i in clients) {
      clients[i].emit("refresh_announcement", { shouldRefresh: true });
    }
    return res.status(200).json({
      message: "Announcement successfully created!",
      status: 200,
      result: result,
    });
  });
};

const editAnnouncement = (req: Request, res: Response) => {
  const {
    AnnouncementID,
    AnnouncementImage,
    AnnouncementTitle,
    AnnouncementDescription,
    AnnouncementDate,
  } = <IAnnouncements>req.body;

  const validate_announcements_fields = edit_announcement_validator.validate({
    AnnouncementID,
    AnnouncementImage,
    AnnouncementTitle,
    AnnouncementDescription,
    AnnouncementDate,
  });

  if (validate_announcements_fields.error) {
    return res.status(400).json({
      error: validate_announcements_fields.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "UPDATE tbl_announcements SET `AnnouncementImage` = ?, `AnnouncementTitle` = ?, `AnnouncementDescription` = ?, `AnnouncementDate` = ? WHERE `AnnouncementID` = ? LIMIT 1;";

  connection.query(
    query,
    [
      AnnouncementImage,
      badwords.filter(AnnouncementTitle),
      badwords.filter(AnnouncementDescription),
      AnnouncementDate,
      AnnouncementID,
    ],
    (error, result) => {
      if (error) return res.status(400).json({ error: error, status: 400 });

      for (var i in clients) {
        clients[i].emit("refresh_announcement", { shouldRefresh: true });
      }
      return res.status(200).json({
        message: "Announcement successfully edited!",
        status: 200,
        result: result,
      });
    }
  );
};

const deleteAnnouncement = (req: Request, res: Response) => {
  const AnnouncementID = req.params.AnnouncementID.split(":")[1];

  const validate_delete_announcement = delete_announcement_validator.validate({
    AnnouncementID,
  });

  if (validate_delete_announcement.error) {
    return res.status(400).json({
      error: validate_delete_announcement.error.details[0].message,
      status: 400,
    });
  }
  const query = "DELETE FROM tbl_announcements WHERE `AnnouncementID` = ?";

  connection.query(query, [AnnouncementID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });
    for (var i in clients) {
      clients[i].emit("refresh_announcement", { shouldRefresh: true });
    }
    return res.status(200).json({
      message: "Announcement successfully deleted!",
      status: 200,
      result: result,
    });
  });
};

export {
  all_announcements,
  all_today_announcements,
  total_announcements,
  createAnnouncement,
  editAnnouncement,
  deleteAnnouncement,
};
