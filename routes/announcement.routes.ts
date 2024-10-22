import express from "express";
import {
  createAnnouncement,
  editAnnouncement,
  deleteAnnouncement,
  all_announcements,
  all_today_announcements,
  total_announcements,
} from "../controllers/announcement.controllers";
import verifyWebAuthToken from "../middlewares/verifyTokenWeb";
import verifyAuthToken from "../middlewares/verifyToken";

const announcements_routes = express.Router();
const user_announcemnt_routes = express.Router();
announcements_routes.get(
  "/all_announcements",
  verifyWebAuthToken,
  all_announcements
);
announcements_routes.get(
  "/all_todays_announcements",
  verifyWebAuthToken,
  all_today_announcements
);
user_announcemnt_routes.get(
  "/all_announcements",
  verifyAuthToken,
  all_announcements
);
user_announcemnt_routes.get(
  "/all_todays_announcements",
  verifyAuthToken,
  all_today_announcements
);
announcements_routes.get(
  "/total_announcements",
  verifyWebAuthToken,
  total_announcements
);
announcements_routes.post(
  "/create_announcement",
  verifyWebAuthToken,
  createAnnouncement
);
announcements_routes.post(
  "/edit_announcement",
  verifyWebAuthToken,
  editAnnouncement
);
announcements_routes.delete(
  "/delete_announcement:AnnouncementID",
  verifyWebAuthToken,
  deleteAnnouncement
);
export default announcements_routes;
export { user_announcemnt_routes };
