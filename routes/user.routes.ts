import express from "express";
import {
  loginController,
  registerController,
  logoutController,
  editUserController,
  forgotPasswordController,
  changePasswordController,
  sendEmailController,
  upload,
  addExpoTokenUserController,
  logoutUserWebController,
  loginUserWebController,
  loginAsGuestController,
  adminRegisterUserController,
  getUsersController,
  updateUserSubscription,
  setUserActivationController,
  deleteUserController,
  getTotalUserController,
  getTotalSessionUserController,
  getTotalMonthlyUserController,
  adminChangeAccountController,
  editAdminController,
  sendEmailForSubscriptionController,
} from "../controllers/user.controllers";
import verifyWebAuthToken from "../middlewares/verifyTokenWeb";
import verifyAuthToken from "../middlewares/verifyToken";
import verifyAuthWeb from "../middlewares/verifyAuthWeb";

const user_routes = express.Router();
export const admin_routes = express.Router();

user_routes.post("/register_account", registerController);
user_routes.post("/login_account", loginController);
user_routes.get("/logout_account", logoutController);
user_routes.post("/add_token", addExpoTokenUserController);
user_routes.post("/edit_account", verifyAuthToken, editUserController);
user_routes.post("/forgot_password", forgotPasswordController);
user_routes.post("/change_password", changePasswordController);
user_routes.post("/send_email", sendEmailController);
user_routes.post(
  "/send_payment_verification",
  sendEmailForSubscriptionController
);
user_routes.post("/activate_account", setUserActivationController);

admin_routes.get("/all_users", verifyWebAuthToken, getUsersController);
admin_routes.post("/login_account", loginUserWebController);
admin_routes.get("/login_as_guest", loginAsGuestController);
admin_routes.get("/logout_account", logoutUserWebController);
admin_routes.post("/forgot_password", forgotPasswordController);
admin_routes.post("/change_password", changePasswordController);
admin_routes.post(
  "/change_account",
  verifyWebAuthToken,
  adminChangeAccountController
);
admin_routes.post("/edit_account", verifyWebAuthToken, editAdminController);
admin_routes.get(
  "/all_total_session_users",
  verifyWebAuthToken,
  getTotalSessionUserController
);
admin_routes.get(
  "/all_total_monthly_users",
  verifyWebAuthToken,
  getTotalMonthlyUserController
);
admin_routes.get(
  "/all_total_users",
  verifyWebAuthToken,
  getTotalUserController
);
admin_routes.post(
  "/register_user_account",
  verifyWebAuthToken,
  adminRegisterUserController
);
admin_routes.post(
  "/update_subscription",
  verifyWebAuthToken,
  updateUserSubscription
);
admin_routes.delete("/delete_user/:UserID", deleteUserController);

user_routes.get("/dashboard", verifyAuthToken, (req, res) => {
  return res.json({
    message: "Welcome to dashboard!",
    user: res.locals.payload,
    isAuthenticated: res.locals.isAuthenticated,
    accessToken: res.locals.accessToken,
  });
});
admin_routes.get("/dashboard", verifyWebAuthToken, (req, res) => {
  return res.json({
    message: "Welcome to dashboard web!",
    user: res.locals.payload,
    isAuthenticated: res.locals.isAuthenticated,
    accessToken: res.locals.accessToken,
  });
});
admin_routes.get("/auth_dashboard", verifyAuthWeb, (req, res) => {
  return res.json({
    message: "You are authenticated in dashboard web!",
    user: res.locals.payload,
    isAuthenticated: res.locals.isAuthenticated,
    accessToken: res.locals.accessToken,
  });
});

export default user_routes;
