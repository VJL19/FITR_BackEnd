import Joi from "joi";
import ISalesAnalytics from "../types/sales_analytics.types";

const sales_field_validator = Joi.object<ISalesAnalytics>({
  AnalyticsEntryDate: Joi.date().required(),
});

const dailySalesValidator = Joi.object({
  SubscriptionType: Joi.string().required(),
});

const create_subscription_using_mphone_validator = Joi.object<ISalesAnalytics>({
  SubscriptionID: Joi.number().required(),
  AnalyticsAmount: Joi.number().required(),
  AnalyticsEntryDate: Joi.date().required(),
});

const create_subscription_without_mphone_validator =
  Joi.object<ISalesAnalytics>({
    No_M_SubscriptionID: Joi.number().required(),
    AnalyticsAmount: Joi.number().required(),
    AnalyticsEntryDate: Joi.date().required(),
  });
export {
  sales_field_validator,
  create_subscription_using_mphone_validator,
  create_subscription_without_mphone_validator,
  dailySalesValidator,
};
