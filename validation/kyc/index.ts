import Joi from "joi";

export const kycCreateSchema = Joi.object({
  streetAddress: Joi.string().required(),
  streetAddress2: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  postalCode: Joi.string().required(),
  country: Joi.string().required(),
  faceImage: Joi.any().meta({ swaggerType: "file" }).required(),
  video: Joi.any().meta({ swaggerType: "file" }).required(),
  frontImage: Joi.any().meta({ swaggerType: "file" }).required(),
  backImage: Joi.any().meta({ swaggerType: "file" }).optional(),
  kycDocument: Joi.object({
    kycType: Joi.boolean().required(),
    // faceMatch: Joi.object({
    //   aiResult: Joi.number().default(0),
    //   mannualResult: Joi.number().default(0),
    // }),
    // liveTest: Joi.object({
    //   aiResult: Joi.number().default(0),
    //   mannualResult: Joi.number().default(0),
    // }),
    pancard: Joi.object({
      name: Joi.string().required(),
      pancardNumber: Joi.string().required(),
      birthday: Joi.date().required(),
    }),
    passport: Joi.object({
      name: Joi.string().required(),
      passportNumber: Joi.string().required(),
      birthday: Joi.date().required(),
      nationality: Joi.string().required(),
      issueDate: Joi.date().required(),
      expiryDate: Joi.date().required(),
      gender: Joi.boolean().required(),
    }),
  }),
  status: Joi.object({
    changedBy: Joi.string().required(),
    kycStatus: Joi.string().valid("Pending", "Approved", "Rejected").required(),
    auditStatus: Joi.string()
      .valid("Pending", "Approved", "Rejected")
      .required(),
  }),
  applicationName: Joi.string().default("KYC"),
  createdAt: Joi.date().default(Date.now()),
  comments: Joi.array()
    .items(
      Joi.object({
        action: Joi.string().required(),
        actionDate: Joi.date().default(Date.now()),
      })
    )
    .default([]),
  updatedAt: Joi.date().default(Date.now()),
});

export const getKYCSchema = Joi.object({
  status: Joi.string().optional().description("KYC status"),
  user: Joi.string().optional().description("Whether to include user data"),
  page: Joi.number().optional().description("Page number"),
});

export const updateKYCSchema = Joi.object({
  panManual: Joi.number().optional().messages({
    "number.base": "Provide valid number.",
  }),
  liveManual: Joi.number().optional().messages({
    "number.base": "Provide valid number.",
  }),
  status: Joi.string()
    .valid("Pending", "Approved", "Rejected")
    .optional()
    .messages({
      "string.valid": "Provide valid status.",
    }),
});
