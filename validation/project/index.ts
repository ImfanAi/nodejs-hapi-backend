import Joi from "joi";

export const projectCreateSchema = Joi.object({
  projectName: Joi.string().required(),
  projectImage: Joi.any().meta({ swaggerType: "file" }).required(),
  description: Joi.string().required(),
  imoNumber: Joi.number().required(),
  vesselType: Joi.string().required(),
  builtYear: Joi.date().required(),
  flag: Joi.string().required(),
  estimatedEarning: Joi.number().required(),
  projectType: Joi.boolean().required(),
  fundSTDate: Joi.date().optional(),
  fundEDDate: Joi.date().optional(),
  tradingSTDate: Joi.date().optional(),
  tradingEDDate: Joi.date().optional(),
});

export const uploadDocumentSchema = Joi.object({
  technicalReport: Joi.any().meta({ swaggerType: "file" }).required(),
  financialReport: Joi.any().meta({ swaggerType: "file" }).required(),
  commercialReport: Joi.any().meta({ swaggerType: "file" }).required(),
  risk: Joi.any().meta({ swaggerType: "file" }).required(),
  community: Joi.any().meta({ swaggerType: "file" }).required(),
  vesselCertificate: Joi.any().meta({ swaggerType: "file" }).required(),
});

export const uploadDocumentSchema1 = Joi.object({
  detail: Joi.any().meta({ swaggerType: "file" }).required(),
});
export const getProjectSchema = Joi.object({
  tokenized: Joi.boolean().optional().description("Project tokenized"),
  sto: Joi.boolean().optional().description("Whether to include user data"),
  page: Joi.number().optional().description("Page number"),
  status: Joi.boolean().optional().description("Status"),
  allowance: Joi.number().optional().description("Allowance"),
});

export const tokenizationProjectSchema = Joi.object({
  tokenName: Joi.string().required(),
  tokenSymbol: Joi.string().required(),
  decimal: Joi.number().required(),
  tonnage: Joi.number().required(),
  assetValue: Joi.number().required(),
  tokenizingPercentage: Joi.number().required(),
  offeringPercentage: Joi.number().required(),
  minimumInvestment: Joi.number().required(),
});

export const deleteProjectSchema = Joi.object({
  projectId: Joi.string().required().description("Project Id required"),
});

export const withdrawProjectSchema = Joi.object({
  projectId: Joi.string().required().description("Project Id required"),
});

export const withdrawSubmitProjectSchema = Joi.object({
  projectId: Joi.string().required().description("Project Id required"),
  status: Joi.boolean().required().description("Status"),
});

export const depositProjectSchema = Joi.object({
  projectId: Joi.string().required().description("Project Id required"),
  amount: Joi.number().required().description("Deposit amount is required"),
});

export const investProjectSchema = Joi.object({
  projectId: Joi.string().required().description("Project Id required"),
  amount: Joi.number().required().description("Deposit amount is required"),
});

export const allowanceProjectSchema = Joi.object({
  allowance: Joi.number().required().description("Allowance required"),
});

export const claimProjectSchema = Joi.object({
  projectId: Joi.string().required().description("Project Id required"),
});
