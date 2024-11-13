import express from "express";
import cors from "cors";
import loadConfig from "../utils/types/config.types";
import clients from "../global/socket.global";
import http from "http";
import { Request, Response } from "express";
import { Server } from "socket.io";
import {
  announcements_routes,
  user_routes,
  post_routes,
  newsfeed_routes,
  attendance_routes,
  attendance_routes_admin,
  exercise_favorite_routes,
  workout_favorite_routes,
  workout_routes,
  exercise_routes,
  gym_equipment_routes,
  notification_routes,
  program_planner_routes,
  program_suggested_routes,
  home_routes,
  user_subscription_routes,
  admin_subscription_routes,
  sales_analytics_routes,
  user_announcemnt_routes,
  program_suggested_user_routes,
  generate_reports_routes,
  admin_routes,
  records_routes,
  attendance_analytics,
} from "../routes/index.routes";
import cookieParser from "cookie-parser";
import cron from "node-cron";
import connection from "../config/mysql";
import IUser from "../utils/types/user.types";
import { MysqlError } from "mysql";
//initialize the top of the function express.
const app = express();
const config = loadConfig();

const server = http.createServer(app);

//schedule a task to run every minute to call database and check whether user subscription monthly is end near or 1 day before.
// cron.schedule("*/1 * * * *", () => {
//   const query = "SELECT * FROM tbl_users;";
//   connection.query(query, (error: MysqlError | null, result: IUser[]) => {
//     if (error) throw new Error(error.sqlMessage);

//     const all_users: IUser[] = [];
//     result.forEach((user) => {
//       all_users.push(user);
//     });
//   });
// });

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const io = new Server(server, {
  cors: {
    origin: [
      "https://fitr-web.vercel.app",
      "https://fitrmain-3ovtfxthq-vjl19s-projects.vercel.app/",
      "http://localhost:5173",
      "https://db52-136-158-2-214.ngrok-free.app",
    ],
    allowedHeaders: ["ngrok-skip-browser-warning"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    //Insert origin of native url here...
  },
});

app.use(
  cors({
    origin: [
      "https://fitr-web.vercel.app",
      "https://fitrmain-3ovtfxthq-vjl19s-projects.vercel.app/",
      "http://localhost:5173",
      "https://db52-136-158-2-214.ngrok-free.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],

    credentials: true,
    //Insert origin of native url here...
  })
);

app.get("/", (req, res) => {
  res.json("Working FITR BackEnd");
});

//start the io connection
io.on("connection", (socket) => {
  console.log(`USER ${socket.id} is connected to the server!`);

  clients.push(socket);
  //disconnect method to remvoe the client connected with the socket.
  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("A user disconnected!");
    let i = clients.indexOf(socket);
    clients.splice(i, 1);
  });
});

//allow to view images in the server.
app.use(express.static("public"));

//sample healthcheck
app.get("/api/v1/user/sample_health", (req: Request, res: Response) => {
  return res.status(200).json({ message: "success" });
});

//register generate qr code routes
app.use("/api/v1/admin/attendance/", attendance_routes_admin);

//registe admin announcement routes
app.use("/api/v1/admin/announcement/", announcements_routes);
//register user announcement routes
app.use("/api/v1/user/announcement/", user_announcemnt_routes);

//register transaction/subscription for admin routes.
app.use("/api/v1/admin/subscription", admin_subscription_routes);

//register program_suggested routes.
app.use("/api/v1/admin/program/", program_suggested_routes);

//register sales_analytics routes.
app.use("/api/v1/admin/sales_analytics/", sales_analytics_routes);

//register attendance_analytics routes.
app.use("/api/v1/admin/attendance_analytics/", attendance_analytics);

//register generate_reports rotues.
app.use("/api/v1/admin/generate_report/", generate_reports_routes);

//register record routes.
app.use("/api/v1/admin/records/", records_routes);

//register user routes
app.use("/api/v1/user/", user_routes);

//register admin routes
app.use("/api/v1/admin/user", admin_routes);

//register attendance routes
app.use("/api/v1/user/attendance", attendance_routes);

//register post routes
app.use("/api/v1/user/posts", post_routes);

//register comment routes
app.use("/api/v1/user/newsfeed", newsfeed_routes);

//register exercise favorites routes
app.use("/api/v1/user/favorites/", exercise_favorite_routes);

//register workout favorites routes
app.use("/api/v1/user/favorites/", workout_favorite_routes);

//register workout routes.
app.use("/api/v1/user/workouts/", workout_routes);

//register exercise routes.
app.use("/api/v1/user/exercises/", exercise_routes);

//register gym equipment routes.
app.use("/api/v1/user/gym_equipments/", gym_equipment_routes);

//register notification routes.
app.use("/api/v1/user/notifications/", notification_routes);

//register program_planner routes.
app.use("/api/v1/user/program/", program_planner_routes);
app.use("/api/v1/user/program/", program_suggested_user_routes);

//register home/main dashboard routes.
app.use("/api/v1/user/home/", home_routes);

//register transcation/subscription for user routes.
app.use("/api/v1/user/subscription", user_subscription_routes);

//start the server
server.listen(config.PORT, () => {
  console.log(`SERVER IS LISTENING ON PORT ${config.PORT}`);
});
export default app;
