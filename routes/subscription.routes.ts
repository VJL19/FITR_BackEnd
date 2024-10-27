import express from "express";
import {
  getAllSubscriptionsAdminController,
  getAllSubscriptionsUserController,
  createSubscriptionController,
  fulfillSubscriptionController,
  insertSubscriptionController,
  editSubscriptionController,
  deleteSubscriptionController,
  getSpecificSubscriptionUserController,
  getSubscriptionHistoryController,
  getSubscriptionHistoryByDateController,
  getAllSubscriptionsByDateController,
  getAllRecentSubscriptionsController,
  getAllPendingSubscriptionsController,
  getAllFulfillSubscriptionsController,
  adminCreateSubscriptionController,
  getAllSubscriptionsUserHistoryController,
} from "../controllers/subscription.controllers";

import { Response } from "express";
import verifyWebAuthToken from "../middlewares/verifyTokenWeb";
import verifyAuthToken from "../middlewares/verifyToken";

const user_subscription_routes = express.Router();
const admin_subscription_routes = express.Router();

user_subscription_routes.get(
  "/all_subscriptions",
  verifyWebAuthToken,
  getAllSubscriptionsUserController
);
user_subscription_routes.get(
  "/history/all_subscriptions",
  verifyWebAuthToken,
  getAllSubscriptionsUserHistoryController
);
user_subscription_routes.get("/success_payment", (_, res: Response) => {
  return res.status(200).send("Success");
});
user_subscription_routes.get(
  "/specific_subscription:UserID",
  getSpecificSubscriptionUserController
);
user_subscription_routes.get(
  "/subscription_history:UserID",
  verifyAuthToken,
  getSubscriptionHistoryController
);
user_subscription_routes.post(
  "/subscription_history_by_date",
  verifyAuthToken,
  getSubscriptionHistoryByDateController
);
user_subscription_routes.post(
  "/create_subscription",
  verifyAuthToken,
  createSubscriptionController
);
user_subscription_routes.get(
  "/all_subscriptions",
  getAllSubscriptionsAdminController
);
admin_subscription_routes.post(
  "/fulfill_subscription",
  verifyWebAuthToken,
  fulfillSubscriptionController
);
admin_subscription_routes.post(
  "/create_subscription",
  verifyWebAuthToken,
  adminCreateSubscriptionController
);

admin_subscription_routes.get(
  "/all_subscriptions_by_date/:selectedDate",
  verifyWebAuthToken,
  getAllSubscriptionsByDateController
);

admin_subscription_routes.get(
  "/all_recent_subscriptions",
  verifyWebAuthToken,
  getAllRecentSubscriptionsController
);
admin_subscription_routes.get(
  "/all_pending_subscriptions",
  verifyWebAuthToken,
  getAllPendingSubscriptionsController
);
admin_subscription_routes.get(
  "/all_fulfill_subscriptions",
  verifyWebAuthToken,
  getAllFulfillSubscriptionsController
);

admin_subscription_routes.post(
  "/insert_subscription",
  verifyWebAuthToken,
  insertSubscriptionController
);
admin_subscription_routes.post(
  "/edit_subscription",
  verifyWebAuthToken,
  editSubscriptionController
);
admin_subscription_routes.delete(
  "/delete_subscription:SubscriptionID",
  verifyWebAuthToken,
  deleteSubscriptionController
);

export { user_subscription_routes, admin_subscription_routes };
