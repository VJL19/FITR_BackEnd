import Joi from "joi";
import ISubscriptions from "../types/subscription.types";

const scan_subscription_validator = Joi.object<ISubscriptions>({
  UserID: Joi.number().required(),
  SubscriptionAmount: Joi.number().required(),
  SubscriptionBy: Joi.string().required(),
  SubscriptionType: Joi.string().required(),
  SubscriptionMethod: Joi.string().required(),
  SubscriptionUploadedImage: Joi.string().required(),
  SubscriptionEntryDate: Joi.date().required(),
});

const fulfill_subscription_validator = Joi.object<ISubscriptions>({
  SubscriptionStatus: Joi.string().required(),
  SubscriptionID: Joi.number().required(),
});
const admin_createSubscription_validator = Joi.object<ISubscriptions>({
  SubscriptionAmount: Joi.number().required(),
  SubscriptionBy: Joi.string().required(),
  SubscriptionType: Joi.string().required(),
  SubscriptionMethod: Joi.string().required(),
});

const create_subscription_validator = Joi.object<ISubscriptions>({
  LastName: Joi.string().required(),
  FirstName: Joi.string().required(),
  SubscriptionAmount: Joi.string().required(),
  SubscriptionType: Joi.string().required(),
  SubscriptionEntryDate: Joi.date().required(),
});

const edit_subcription_validator = Joi.object<ISubscriptions>({
  SubscriptionID: Joi.number().required(),
  LastName: Joi.string().required(),
  FirstName: Joi.string().required(),
  SubscriptionAmount: Joi.number().required(),
  SubscriptionType: Joi.string().required(),
});

const delete_subscription_validator = Joi.object<ISubscriptions>({
  SubscriptionID: Joi.number().required(),
});

export {
  scan_subscription_validator,
  admin_createSubscription_validator,
  fulfill_subscription_validator,
  create_subscription_validator,
  edit_subcription_validator,
  delete_subscription_validator,
};
