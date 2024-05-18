import Joi from "joi";

export const createUserSchema = Joi.object({
  firstName: Joi.string().required().messages({
    "any.required": "Please provide first name.",
  }),
  lastName: Joi.string().required().messages({
    "any.required": "Please provide last name.",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "Please provide email",
    "string.email": "Please provide a valid email.",
  }),
  phoneNumber: Joi.string().required().messages({
    "any.required": "Please provide phone number.",
  }),
  password: Joi.string().required().min(6).messages({
    "any.required": "Please provide password.",
    "string.min": "Password must be at least 6 characters.",
  }),
  role: Joi.string().required().messages({
    "any.required": "Please provide role.",
  }),
  referralCode: Joi.string().allow("").optional(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Please provide email",
    "string.email": "Please provide a valid email.",
  }),
  password: Joi.string().required().min(6).messages({
    "any.required": "Please provide password.",
    "string.min": "Password must be at least 6 characters.",
  }),
});

export const googleLoginUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Please provide email",
    "string.email": "Please provide a valid email.",
  }),
  fullName: Joi.string().required().min(1).messages({
    "any.required": "Please provide fullname.",
    "string.min": "Fullname must be at least 6 characters.",
  }),
});

export const resendSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Please provide email",
    "string.email": "Please provide a valid email.",
  }),
});

export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Please provide email",
    "string.email": "Please provide a valid email.",
  }),
});

export const resetPasswordPostSchema = Joi.object({
  token: Joi.string().required().messages({
    "any.required": "Please provide token",
  }),
  password: Joi.string().required().messages({
    "any.required": "Please provide password",
  }),
});

export const otpSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Please provide email",
    "string.email": "Please provide a valid email.",
  }),
  otp: Joi.string().required().min(6).max(6).messages({
    "any.required": "Please provide otp.",
    "string.min": "OTP must be exactly 6 characters.",
  }),
});

export const userUpdateSchema = Joi.object({
  firstName: Joi.string().optional(),
  email: Joi.string().email().messages({
    "string.email": "Please provide a valid email.",
  }),
  password: Joi.string().min(6).messages({
    "string.min": "Password must be at least 6 characters.",
  }),
  lastName: Joi.string().optional(),
  phoneNumber: Joi.string().optional(),
  role: Joi.string().optional(),
  referralCode: Joi.string().optional(),
});

export const getAllUserSchema = Joi.object({
  id: Joi.string().optional().description("Id"),
  firstName: Joi.string().optional().description("FirstName"),
  lastName: Joi.string().optional().description("LastName"),
  middleName: Joi.string().optional().description("MiddleName"),
  email: Joi.string().email().optional().description("Email"),
  emailVerified: Joi.boolean().optional().description("EmailVerified"),
  role: Joi.string().optional().description("Role"),
  kycStatus: Joi.number().optional().description("kycStatus"),
  status: Joi.boolean().optional().description("status"),
  page: Joi.number().optional().description("Page number"),
});
