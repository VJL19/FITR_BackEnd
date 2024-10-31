import Joi from "joi";
import IUser from "../types/user.types";

const edit_validator = Joi.object<IUser>({
  UserID: Joi.number().required(),
  ProfilePic: Joi.string().optional(),
  Username: Joi.string().alphanum().min(5).max(30).required(),
  Email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "ph"] } })
    .message("Only .com and .ph email are allowed.")
    .required(),
  ContactNumber: Joi.string().max(11).required(),
  Password: Joi.string().alphanum().min(5).max(30).required(),
  ConfirmPassword: Joi.any()
    .valid(Joi.ref("Password"))
    .required()
    .messages({ "any.only": "Your Password do not match!" }),
});
const login_validator = Joi.object<IUser>({
  Username: Joi.string().alphanum().min(5).max(30).required(),
  Password: Joi.string().required(),
});
const register_validator = Joi.object<IUser>({
  LastName: Joi.string().required(),
  FirstName: Joi.string().required(),
  MiddleName: Joi.string().required(),
  Age: Joi.number().required(),
  ContactNumber: Joi.string().max(11).required(),
  Birthday: Joi.string().required(),
  Email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "ph"] } })
    .message("Only .com and .ph email are allowed.")
    .required(),
  Height: Joi.number().required(),
  Weight: Joi.number().required(),
  Username: Joi.string().alphanum().min(5).max(30).required(),
  Password: Joi.string()
    .alphanum()
    .min(5)
    .max(30)
    .message("Your Password must be atleast 5 characters")
    .required(),
  ConfirmPassword: Joi.any()
    .valid(Joi.ref("Password"))
    .required()
    .messages({ "any.only": "Your Password do not match!" }),
  ProfilePic: Joi.string().optional(),
  Gender: Joi.string().required(),
  Address: Joi.string().required(),
  SubscriptionType: Joi.string().required(),
  RFIDNumber: Joi.string().allow("").allow(null).optional(),
  IsRFIDActive: Joi.string().allow("").allow(null).optional(),
});

const forgot_password_validator = Joi.object<IUser>({
  Email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "ph"] } })
    .message("Only .com and .ph email are allowed")
    .required(),
});

const change_password_validator = Joi.object({
  Email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "ph"] } })
    .message("Only .com and .ph email are allowed")
    .required(),
  Password: Joi.string()
    .alphanum()
    .min(5)
    .max(30)
    .message("Your Password must be atleast 5 characters")
    .required(),
  ConfirmPassword: Joi.any()
    .valid(Joi.ref("Password"))
    .required()
    .messages({ "any.only": "Your Password do not match!" }),
});
export {
  login_validator,
  register_validator,
  edit_validator,
  forgot_password_validator,
  change_password_validator,
};
