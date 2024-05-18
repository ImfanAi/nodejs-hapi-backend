import Joi from "joi";

export const vesselRegisterSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Please provide vessel name.",
  }),
  description: Joi.string().required().messages({
    "any.required": "Please provide description.",
  }),
});

export const vesselUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
});
