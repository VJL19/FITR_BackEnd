import { Request, Response } from "express";
import connection from "../config/mysql";
import INewsFeed from "../utils/types/newsfeed.types";
import ICommments from "../utils/types/comment.types";
import {
  comment_post_validator,
  create_post_validator_feed,
  delete_post_validator_feed,
  edit_comment_post_validator,
  get_comment_post_validator,
  like_post_validator,
  unlike_post_validator,
} from "../utils/validations/newsfeed.validations";
import clients from "../global/socket.global";
import BadWordsNext from "bad-words-next";
import { fil } from "../utils/helpers/bad-words";

const en = require("bad-words-next/data/en.json");
const badwords = new BadWordsNext();

badwords.add(en);
badwords.add(fil);
const createPostsFromFeedController = (req: Request, res: Response) => {
  const {
    UserID,
    PostImage,
    PostTitle,
    PostDescription,
    PostDate,
    PostAuthor,
  } = <INewsFeed>req.body;

  const validate_fields = create_post_validator_feed.validate({
    UserID,
    PostImage,
    PostTitle,
    PostDescription,
    PostDate,
    PostAuthor,
  });

  if (validate_fields.error) {
    return res
      .status(400)
      .json({ error: validate_fields.error.details[0].message, status: 400 });
  }
  const query =
    "INSERT INTO tbl_newsfeed (`UserID`, `PostID`, `PostImage`, `PostTitle`, `PostDescription`, `PostDate`, `PostAuthor`) VALUES (?, (SELECT PostID FROM tbl_posts ORDER BY PostID DESC LIMIT 1), ?, ?, ?, ?, ?);";

  const values = [
    UserID,
    PostImage,
    PostTitle,
    PostDescription,
    PostDate,
    PostAuthor,
  ];
  connection.query(
    query,
    [UserID, PostImage, PostTitle, PostDescription, PostDate, PostAuthor],
    (error, result) => {
      if (error) return res.status(400).json({ error: error, status: 400 });

      return res.status(200).json({
        message: "New post inserted to feed successfully!",
        status: 200,
        result: result,
      });
    }
  );
};

const deletePostFromFeedController = (req: Request, res: Response) => {
  const PostID = req.params.PostID.split(":")[1];

  const validate_field = delete_post_validator_feed.validate({ PostID });

  if (validate_field.error) {
    return res.status(400).json({
      error: validate_field.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "SET FOREIGN_KEY_CHECKS=0; DELETE FROM tbl_newsfeed WHERE `PostID` = ? LIMIT 1";

  connection.query(query, [PostID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Post in feed deleted successfully!",
      status: 200,
      result: result,
    });
  });
};
const getAllPostsController = (req: Request, res: Response) => {
  const SubscriptionType = req.params.SubscriptionType.split(":")[1];
  const query =
    "SELECT n.UserID, n.PostID, n.NewsfeedID, n.PostImage, n.PostTitle, n.PostDescription, n.PostDate, n.PostAuthor, n.Username, a.SubscriptionType, a.ProfilePic FROM tbl_newsfeed n LEFT JOIN tbl_users a ON n.UserID = a.UserID WHERE `SubscriptionType` = ? ORDER BY n.PostDate DESC;";

  connection.query(query, [SubscriptionType], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Get all posts successfully!",
      status: 200,
      result: result,
    });
  });
};

const getSpecificPostsController = (req: Request, res: Response) => {
  const NewsfeedID = req.params.NewsfeedID.split(":")[1];

  const query = "SELECT * FROM tbl_newsfeed WHERE `NewsfeedID` = ? LIMIT 1";

  connection.query(query, [NewsfeedID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Get specific posts successfully!",
      status: 200,
      result: result,
    });
  });
};

const likePostController = (req: Request, res: Response) => {
  const { UserID, NewsfeedID, PostLikes } = <INewsFeed>req.body;

  const validate_like = like_post_validator.validate({
    UserID,
    NewsfeedID,
  });

  if (validate_like.error) {
    return res.status(400).json({
      error: validate_like.error.details[0].message,
      status: 400,
    });
  }

  const query = `SET @LIKES = 0; INSERT INTO tbl_likes (UserID, NewsfeedID, PostLikes, PostIsLike) VALUES (?, ?,@LIKES := @LIKES + 1, 'liked');`;

  connection.query(query, [UserID, NewsfeedID, PostLikes], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(400).json({ error: error, status: 400 });
    }

    for (var i in clients) {
      clients[i].emit("refresh_post");
    }
    return res.status(200).json({
      message: "Like posts successfully!",
      status: 200,
      result: result,
    });
  });
};

const unlikePostController = (req: Request, res: Response) => {
  const { UserID, NewsfeedID } = <INewsFeed>req.body;

  const validate_unlike = unlike_post_validator.validate({
    UserID,
    NewsfeedID,
  });

  if (validate_unlike.error) {
    return res.status(400).json({
      error: validate_unlike.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "DELETE FROM tbl_likes WHERE `NewsfeedID` = ? AND `UserID` = ? LIMIT 1";

  connection.query(query, [NewsfeedID, UserID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    for (var i in clients) {
      clients[i].emit("refresh_post");
    }
    return res.status(200).json({
      message: "Unlike post successfully!",
      status: 200,
      result: result,
    });
  });
};

const checkLikePostController = (req: Request, res: Response) => {
  const { UserID, NewsfeedID } = <INewsFeed>req.body;

  const validate_unlike = unlike_post_validator.validate({
    UserID,
    NewsfeedID,
  });

  if (validate_unlike.error) {
    return res.status(400).json({
      error: validate_unlike.error.details[0].message,
      status: 400,
    });
  }
  const query = "SELECT * FROM tbl_likes WHERE UserID = ? AND NewsfeedID = ?;";

  connection.query(query, [UserID, NewsfeedID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "Filter specific like post successfully!",
      status: 200,
      result: result,
    });
  });
};

const commentPostController = (req: Request, res: Response) => {
  const { CommentText, UserID, NewsfeedID, CommentDate } = <ICommments>req.body;

  const query =
    "INSERT INTO tbl_comments (`CommentText`, `UserID`, `NewsfeedID`, `CommentDate`) VALUES (?);";

  const validate_comment = comment_post_validator.validate({
    CommentText,
    UserID,
    NewsfeedID,
    CommentDate,
  });

  if (validate_comment.error) {
    return res.status(400).json({
      error: validate_comment.error.details[0].message,
      status: 400,
    });
  }
  const values = [
    badwords.filter(CommentText),
    UserID,
    NewsfeedID,
    CommentDate,
  ];
  connection.query(query, [values], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    for (var i in clients) {
      clients[i].emit("refresh_post");
    }
    return res.status(200).json({
      message: "Comment on post successfully!",
      status: 200,
      result: result,
    });
  });
};
const editCommentPostsController = (req: Request, res: Response) => {
  const { CommentID, CommentText, CommentDate } = <ICommments>req.body;

  const query =
    "UPDATE tbl_comments SET CommentText = ?, CommentDate = ? WHERE CommentID = ? LIMIT 1;";

  const validate_comment = edit_comment_post_validator.validate({
    CommentID,
    CommentText,
    CommentDate,
  });

  if (validate_comment.error) {
    return res.status(400).json({
      error: validate_comment.error.details[0].message,
      status: 400,
    });
  }
  connection.query(
    query,
    [badwords.filter(CommentText), CommentDate, CommentID],
    (error, result) => {
      if (error) return res.status(400).json({ error: error, status: 400 });

      for (var i in clients) {
        clients[i].emit("refresh_post");
      }
      return res.status(200).json({
        message: "edit comment on this post successfully!",
        status: 200,
        result: result,
      });
    }
  );
};

const getAllCommentPostsController = (req: Request, res: Response) => {
  const NewsfeedID = req.params.NewsfeedID.split(":")[1];

  const query =
    "SELECT c.UserID, c.NewsfeedID, c.CommentID, c.CommentText, c.CommentDate, u.Username, u.ProfilePic FROM tbl_comments c LEFT JOIN tbl_users u ON c.UserID = u.UserID WHERE c.NewsfeedID = ? ORDER BY c.CommentDate DESC;";

  const validate_get_posts = get_comment_post_validator.validate({
    NewsfeedID,
  });

  if (validate_get_posts.error) {
    return res.status(400).json({
      error: validate_get_posts.error.details[0].message,
      status: 400,
    });
  }
  connection.query(query, [NewsfeedID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    return res.status(200).json({
      message: "All comment get successfully!",
      status: 200,
      result: result,
    });
  });
};

const removeUserComments = (req: Request, res: Response) => {
  const NewsfeedID = req.params.NewsfeedID.split(":")[1];

  const query = "DELETE FROM tbl_comments WHERE `NewsfeedID` = ? LIMIT 1;";

  connection.query(query, [NewsfeedID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    console.log("delete user comment on this post!", result);
    return res.status(200).json({
      message: "Removed comment successfully!",
      status: 200,
      result: result,
    });
  });
};

const removeUserSpecificComment = (req: Request, res: Response) => {
  const CommentID = req.params.CommentID.split(":")[1];

  const query = "DELETE FROM tbl_comments WHERE `CommentID` = ? LIMIT 1;";

  connection.query(query, [CommentID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });

    console.log("delete user comment on this post!", result);
    return res.status(200).json({
      message: "Removed comment successfully!",
      status: 200,
      result: result,
    });
  });
};

const removeUserLikes = (req: Request, res: Response) => {
  const NewsfeedID = req.params.NewsfeedID.split(":")[1];

  const query = "DELETE FROM tbl_likes WHERE `NewsfeedID` = ?;";

  connection.query(query, [NewsfeedID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });
    console.log("delete user likes on this post!", result);
    return res.status(200).json({
      message: "Unlike post successfully!",
      status: 200,
      result: result,
    });
  });
};

const getPostLikes = (req: Request, res: Response) => {
  const NewsfeedID = req.params.NewsfeedID.split(":")[1];

  const query =
    "SELECT COUNT(*) as likeCounts FROM tbl_likes WHERE `NewsfeedID` = ?;";

  connection.query(query, [NewsfeedID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });
    return res.status(200).json({
      message: "All posts total likes is display successfully!",
      status: 200,
      result: result,
    });
  });
};
const getPostComments = (req: Request, res: Response) => {
  const NewsfeedID = req.params.NewsfeedID.split(":")[1];

  const query =
    "SELECT COUNT(*) as commentCounts FROM tbl_comments WHERE `NewsfeedID` = ?;";

  connection.query(query, [NewsfeedID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });
    return res.status(200).json({
      message: "All posts total comments is display successfully!",
      status: 200,
      result: result,
    });
  });
};

export {
  deletePostFromFeedController,
  createPostsFromFeedController,
  getAllCommentPostsController,
  getAllPostsController,
  getSpecificPostsController,
  editCommentPostsController,
  getPostLikes,
  getPostComments,
  likePostController,
  unlikePostController,
  commentPostController,
  checkLikePostController,
  removeUserComments,
  removeUserSpecificComment,
  removeUserLikes,
};
