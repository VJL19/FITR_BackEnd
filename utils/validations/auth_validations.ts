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
  RFIDNumber: Joi.string().allow("").allow(null).optional(),
  Password: Joi.string()
    .min(8)
    .max(30)
    .pattern(/(?=(?:.*[a-z]){1,16}).+/, "lowercase")
    .pattern(/(?=(?:.*[A-Z]){1,16}).+/, "uppercase")
    .pattern(/(?=(?:.*[0-9]){1,16}).+/, "number")
    .pattern(/(?=(?:.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]){1,16}).+/, "special")
    .required()
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.code) {
          case "string.base":
          case "string.empty":
          case "any.required":
          default:
            err.message = "Password is required.";
            break;
          case "string.min":
            err.message = "Password should not be minimum 8 characters.";
            break;
          case "string.max":
            err.message = "Password max at 30 characters.";
            break;
          case "string.pattern.name":
            switch (err.local.name) {
              case "lowercase":
                err.message =
                  "Password must contain at least 1 lower-case letter";
                break;
              case "uppercase":
                err.message =
                  "Password must contain at least 1 upper-case letter";
                break;
              case "number":
                err.message = "Password must contain at least 1 number";
                break;
              case "special":
                err.message =
                  "Password must contain at least 1 special character";
                break;
            }
            break;
        }
      });
      return errors;
    }),
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
    .min(8)
    .max(30)
    .pattern(/(?=(?:.*[a-z]){1,16}).+/, "lowercase")
    .pattern(/(?=(?:.*[A-Z]){1,16}).+/, "uppercase")
    .pattern(/(?=(?:.*[0-9]){1,16}).+/, "number")
    .pattern(/(?=(?:.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]){1,16}).+/, "special")
    .required()
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.code) {
          case "string.base":
          case "string.empty":
          case "any.required":
          default:
            err.message = "Password is required.";
            break;
          case "string.min":
            err.message = "Password should not be minimum 8 characters.";
            break;
          case "string.max":
            err.message = "Password max at 30 characters.";
            break;
          case "string.pattern.name":
            switch (err.local.name) {
              case "lowercase":
                err.message =
                  "Password must contain at least 1 lower-case letter";
                break;
              case "uppercase":
                err.message =
                  "Password must contain at least 1 upper-case letter";
                break;
              case "number":
                err.message = "Password must contain at least 1 number";
                break;
              case "special":
                err.message =
                  "Password must contain at least 1 special character";
                break;
            }
            break;
        }
      });
      return errors;
    }),
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
    .min(8)
    .max(30)
    .pattern(/(?=(?:.*[a-z]){1,16}).+/, "lowercase")
    .pattern(/(?=(?:.*[A-Z]){1,16}).+/, "uppercase")
    .pattern(/(?=(?:.*[0-9]){1,16}).+/, "number")
    .pattern(/(?=(?:.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]){1,16}).+/, "special")
    .required()
    .error((errors) => {
      errors.forEach((err) => {
        switch (err.code) {
          case "string.base":
          case "string.empty":
          case "any.required":
          default:
            err.message = "Password is required.";
            break;
          case "string.min":
            err.message = "Password should not be minimum 8 characters.";
            break;
          case "string.max":
            err.message = "Password max at 30 characters.";
            break;
          case "string.pattern.name":
            switch (err.local.name) {
              case "lowercase":
                err.message =
                  "Password must contain at least 1 lower-case letter";
                break;
              case "uppercase":
                err.message =
                  "Password must contain at least 1 upper-case letter";
                break;
              case "number":
                err.message = "Password must contain at least 1 number";
                break;
              case "special":
                err.message =
                  "Password must contain at least 1 special character";
                break;
            }
            break;
        }
      });
      return errors;
    }),
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
