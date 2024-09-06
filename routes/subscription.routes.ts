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
} from "../controllers/subscription.controllers";

const user_subscription_routes = express.Router();
const admin_subscription_routes = express.Router();

user_subscription_routes.get(
  "/all_subscriptions",
  getAllSubscriptionsUserController
);
user_subscription_routes.get(
  "/specific_subscription:UserID",
  getSpecificSubscriptionUserController
);
user_subscription_routes.get(
  "/subscription_history:UserID",
  getSubscriptionHistoryController
);
user_subscription_routes.post(
  "/subscription_history_by_date",
  getSubscriptionHistoryByDateController
);
user_subscription_routes.post(
  "/create_subscription",
  createSubscriptionController
);
user_subscription_routes.get(
  "/all_subscriptions",
  getAllSubscriptionsAdminController
);
admin_subscription_routes.post(
  "/fulfill_subscription",
  fulfillSubscriptionController
);
admin_subscription_routes.post(
  "/create_subscription",
  adminCreateSubscriptionController
);

admin_subscription_routes.get(
  "/all_subscriptions_by_date/:selectedDate",
  getAllSubscriptionsByDateController
);

admin_subscription_routes.get(
  "/all_recent_subscriptions",
  getAllRecentSubscriptionsController
);
admin_subscription_routes.get(
  "/all_pending_subscriptions",
  getAllPendingSubscriptionsController
);
admin_subscription_routes.get(
  "/all_fulfill_subscriptions",
  getAllFulfillSubscriptionsController
);

admin_subscription_routes.post(
  "/insert_subscription",
  insertSubscriptionController
);
admin_subscription_routes.post(
  "/edit_subscription",
  editSubscriptionController
);
admin_subscription_routes.delete(
  "/delete_subscription:SubscriptionID",
  deleteSubscriptionController
);

export { user_subscription_routes, admin_subscription_routes };
