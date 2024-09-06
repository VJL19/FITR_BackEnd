import express from "express";
import {
  getSpecificPostController,
  createPostController,
  editPostController,
  deletePostController,
} from "../controllers/post.controllers";
import verifyAuthToken from "../middlewares/verifyToken";
const post_routes = express.Router();

post_routes.get(
  "/specific_post/:UserID",
  verifyAuthToken,
  getSpecificPostController
);
post_routes.post("/create_post", verifyAuthToken, createPostController);
post_routes.post("/edit_post", verifyAuthToken, editPostController);
post_routes.delete(
  "/delete_post/:PostID",
  verifyAuthToken,
  deletePostController
);

export default post_routes;
