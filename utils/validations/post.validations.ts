import Joi from "joi";
import { IPost } from "../types/post.types";

const create_post_validator = Joi.object<IPost>({
  UserID: Joi.number().required(),
  PostImage: Joi.string().optional(),
  PostTitle: Joi.string().required(),
  PostDescription: Joi.string().required(),
  PostDate: Joi.string().required(),
  PostAuthor: Joi.string().required(),
  Username: Joi.string().required(),
});

const edit_post_validator = Joi.object<IPost>({
  PostID: Joi.number().required(),
  PostImage: Joi.string().optional(),
  PostTitle: Joi.string().required(),
  PostDescription: Joi.string().required(),
  PostDate: Joi.string().required(),
  PostAuthor: Joi.string().required(),
  Username: Joi.string().required(),
});

const delete_post_validator = Joi.object<IPost>({
  PostID: Joi.number().required(),
});

const specific_post_validator = Joi.object<IPost>({
  UserID: Joi.number().required(),
});

export {
  specific_post_validator,
  create_post_validator,
  edit_post_validator,
  delete_post_validator,
};
