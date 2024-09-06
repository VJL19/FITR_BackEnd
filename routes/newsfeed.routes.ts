import express from "express";
import {
  commentPostController,
  getAllCommentPostsController,
  getAllPostsController,
  getPostComments,
  getPostLikes,
  likePostController,
  unlikePostController,
  createPostsFromFeedController,
  checkLikePostController,
  deletePostFromFeedController,
  removeUserComments,
  removeUserLikes,
} from "../controllers/newsfeed.controllers";
import verifyAuthToken from "../middlewares/verifyToken";

const newsfeed_routes = express.Router();
newsfeed_routes.post(
  "/create_postfeed",
  verifyAuthToken,
  createPostsFromFeedController
);
newsfeed_routes.post(
  "/all_comments",
  verifyAuthToken,
  getAllCommentPostsController
);
newsfeed_routes.get(
  "/all_posts/:SubscriptionType",
  verifyAuthToken,
  getAllPostsController
);
newsfeed_routes.get("/total_likes/:NewsfeedID", verifyAuthToken, getPostLikes);
newsfeed_routes.get(
  "/total_comments/:NewsfeedID",
  verifyAuthToken,
  getPostComments
);
newsfeed_routes.post("/like_post", verifyAuthToken, likePostController);
newsfeed_routes.post("/unlike_post", verifyAuthToken, unlikePostController);
newsfeed_routes.post("/comment_post", verifyAuthToken, commentPostController);
newsfeed_routes.post(
  "/check_likepost",
  verifyAuthToken,
  checkLikePostController
);
newsfeed_routes.delete(
  "/remove_user_comments/:NewsfeedID",
  verifyAuthToken,
  removeUserComments
);
newsfeed_routes.delete(
  "/remove_user_likes/:NewsfeedID",
  verifyAuthToken,
  removeUserLikes
);

newsfeed_routes.delete(
  "/remove_postfeed/:PostID",
  verifyAuthToken,
  deletePostFromFeedController
);

export default newsfeed_routes;
