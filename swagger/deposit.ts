export const createDepositSwagger = {
  "hapi-swagger": {
    security: [{ jwt: [] }],
    responses: {
      200: {
        description: "Deposit created successfully.",
      },
      400: {
        description: "Input Fields Required.",
      },
      401: {
        description: "Unauthorized",
      },
    },
  },
};
export const ipnSwagger = {
  "hapi-swagger": {
    responses: {
      200: {
        description: "Handle IPN Successfully",
      },
      400: {
        description: "Input Fields Required.",
      },
    },
  },
};
