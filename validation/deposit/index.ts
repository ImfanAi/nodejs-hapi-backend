import Joi from "joi";

export const depositSchema = Joi.object({
  amount: Joi.number().required().min(1).messages({
    "any.required": "Please provide amount.",
    "number.base": "Provide valid number",
    "number.min": "Invest amount must be at least 1",
  }),
});

export const ipnSchema = Joi.object({
  userId: Joi.string().required().messages({
    "any.required": "Please provide userId.",
  }),
  amount: Joi.number().required().min(1).messages({
    "any.required": "Please provide amount.",
    "number.base": "Provide valid number",
    "number.min": "Invest amount must be at least 1",
  }),
});
