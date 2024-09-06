import express from "express";
import {
  createAnnouncement,
  editAnnouncement,
  deleteAnnouncement,
  all_announcements,
  all_today_announcements,
  total_announcements,
} from "../controllers/announcement.controllers";

const announcements_routes = express.Router();

announcements_routes.get("/all_announcements", all_announcements);
announcements_routes.get("/all_todays_announcements", all_today_announcements);
announcements_routes.get("/total_announcements", total_announcements);
announcements_routes.post("/create_announcement", createAnnouncement);
announcements_routes.post("/edit_announcement", editAnnouncement);
announcements_routes.delete(
  "/delete_announcement:AnnouncementID",
  deleteAnnouncement
);
export default announcements_routes;
