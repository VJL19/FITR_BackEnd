import { Request, Response } from "express";
import connection from "../config/mysql";
import { IPost } from "../utils/types/post.types";
import {
  create_post_validator,
  edit_post_validator,
  delete_post_validator,
  specific_post_validator,
} from "../utils/validations/post.validations";
import clients from "../global/socket.global";

const getSpecificPostController = (req: Request, res: Response) => {
  const UserID = req.params.UserID.split(":")[1];

  const validate_specific_post = specific_post_validator.validate({
    UserID,
  });

  if (validate_specific_post.error) {
    return res.status(400).json({
      error: validate_specific_post.error.details[0].message,
      status: 400,
    });
  }
  const query =
    "SELECT * FROM tbl_posts WHERE `UserID` = ? ORDER BY PostDate DESC;";

  connection.query(query, [UserID], (error, result) => {
    if (error) return res.status(400).json({ error: error, status: 400 });
    return res.status(200).json({
      message: "Posts display successfully!",
      status: 200,
      result: result,
    });
  });
};

const createPostController = (req: Request, res: Response) => {
  const {
    UserID,
    PostImage,
    PostTitle,
    PostDescription,
    PostDate,
    PostAuthor,
    Username,
  } = <IPost>req.body;

  const validate_create_fields = create_post_validator.validate({
    UserID,
    PostImage,
    PostTitle,
    PostDescription,
    PostDate,
    PostAuthor,
    Username,
  });

  if (validate_create_fields.error) {
    return res.status(400).json({
      error: validate_create_fields?.error?.details[0].message,
      status: 400,
    });
  }

  const values = [
    UserID,
    PostImage,
    PostTitle,
    PostDescription,
    PostDate,
    PostAuthor,
  ];
  const query =
    "INSERT INTO tbl_posts (`UserID`, `PostImage`, `PostTitle`,`PostDescription`, `PostDate`, `PostAuthor`, `Username`) VALUES (?, ?, ?, ?, ?, ?, ?) LIMIT 1; SET @LAST_ID_IN_TBL_POSTS = LAST_INSERT_ID(); INSERT INTO tbl_newsfeed (`UserID`, `PostID`, `PostImage`, `PostTitle`, `PostDescription`, `PostDate`, `PostAuthor`, `Username`) VALUES (?, @LAST_ID_IN_TBL_POSTS, ?, ?, ?, ?, ?, ?) LIMIT 1; ";

  connection.query(
    query,
    [
      UserID,
      PostImage,
      PostTitle,
      PostDescription,
      PostDate,
      PostAuthor,
      Username,
      UserID,
      PostImage,
      PostTitle,
      PostDescription,
      PostDate,
      PostAuthor,
      Username,
    ],
    (error, result) => {
      if (error) {
        return res.status(400).json({ error: error, status: 400 });
      }

      for (var i in clients) {
        clients[i].emit("refresh_post");
      }

      return res.status(200).json({
        message: "Post created successfully!",
        status: 200,
        result: result,
      });
    }
  );
};

const editPostController = (req: Request, res: Response) => {
  const {
    PostID,
    PostImage,
    PostTitle,
    PostDescription,
    PostDate,
    PostAuthor,
    Username,
  } = <IPost>req.body;

  const validate_edit_fields = edit_post_validator.validate({
    PostID,
    PostImage,
    PostTitle,
    PostDescription,
    PostDate,
    PostAuthor,
    Username,
  });

  if (validate_edit_fields.error) {
    return res.status(400).json({
      error: validate_edit_fields.error.details[0].message,
      status: 400,
    });
  }

  const query =
    "UPDATE tbl_posts SET `PostImage` = ?,`PostTitle` = ?, `PostDescription` = ?, `PostDate` = ?, `PostAuthor` = ?, `Username` = ? WHERE `PostID` = ?;UPDATE tbl_newsfeed SET `PostImage` = ?,`PostTitle` = ?, `PostDescription` = ?, `PostDate` = ?, `PostAuthor` = ?, `Username` = ? WHERE `PostID` = ?;";

  connection.query(
    query,
    [
      PostImage,
      PostTitle,
      PostDescription,
      PostDate,
      PostAuthor,
      Username,
      PostID,
      PostImage,
      PostTitle,
      PostDescription,
      PostDate,
      PostAuthor,
      Username,
      PostID,
    ],
    (error, result) => {
      if (error) return res.status(400).json({ error: error, status: 400 });

      for (var i in clients) {
        clients[i].emit("refresh_post");
      }
      return res.status(200).json({
        message: "Post edited successfully!",
        status: 200,
        result: result,
      });
    }
  );
};

const deletePostController = (req: Request, res: Response) => {
  const PostID = req.params.PostID.split(":")[1];

  const validate_delete_fields = delete_post_validator.validate({
    PostID,
  });
  if (validate_delete_fields.error) {
    return res.status(400).json({
      error: validate_delete_fields.error.details[0].message,
      status: 400,
    });
  }

  const query =
    "SET FOREIGN_KEY_CHECKS=0; DELETE FROM tbl_posts WHERE `PostID` = ? LIMIT 1";

  connection.query(query, [PostID], (error, result) => {
    if (error) {
      console.log(error);
      return res.status(400).json({ error: error, status: 400 });
    }

    for (var i in clients) {
      clients[i].emit("refresh_post");
    }

    return res.status(200).json({
      message: "Post deleted successfully!",
      status: 200,
      result: result,
    });
  });
};

export {
  getSpecificPostController,
  createPostController,
  editPostController,
  deletePostController,
};
