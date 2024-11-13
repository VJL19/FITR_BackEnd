import Joi from "joi";
import INewsFeed from "../types/newsfeed.types";

const create_post_validator_feed = Joi.object<INewsFeed>({
  UserID: Joi.number().required(),
  PostImage: Joi.string().required(),
  PostTitle: Joi.string().required(),
  PostDescription: Joi.string().required(),
  PostDate: Joi.string().required(),
  PostAuthor: Joi.string().required(),
});

const delete_post_validator_feed = Joi.object<INewsFeed>({
  PostID: Joi.number().required(),
});
const like_post_validator = Joi.object<INewsFeed>({
  UserID: Joi.number().required(),
  NewsfeedID: Joi.number().required(),
});

const unlike_post_validator = Joi.object<INewsFeed>({
  UserID: Joi.number().required(),
  NewsfeedID: Joi.number().required(),
});

const comment_post_validator = Joi.object<INewsFeed>({
  NewsfeedID: Joi.number().required(),
  UserID: Joi.number().required(),
  CommentText: Joi.string().required(),
  CommentDate: Joi.string().required(),
});
const edit_comment_post_validator = Joi.object<INewsFeed>({
  CommentID: Joi.number().required(),
  CommentText: Joi.string().required(),
  CommentDate: Joi.string().required(),
});

const get_comment_post_validator = Joi.object<INewsFeed>({
  NewsfeedID: Joi.number().required(),
});
export {
  create_post_validator_feed,
  edit_comment_post_validator,
  like_post_validator,
  unlike_post_validator,
  comment_post_validator,
  get_comment_post_validator,
  delete_post_validator_feed,
};
