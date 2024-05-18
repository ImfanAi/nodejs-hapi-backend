import Joi from "joi";

export const milestoneRegisterSchema = Joi.object({
  action: Joi.string().required().messages({
    "any.required": "Please provide action description.",
  }),
  amount: Joi.number().required().min(1).messages({
    "any.required": "Please provide amount.",
    "number.base": "Provide valid number",
    "number.min": "Milestone amount must be at least 1",
  }),
});

export const milestoneUpdateSchema = Joi.object({
  action: Joi.string(),
  amount: Joi.number().min(1).messages({
    "number.base": "Provide valid number",
    "number.min": "Milestone amount must be at least 1",
  }),
});
