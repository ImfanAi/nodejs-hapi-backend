export const createKYCSwagger = {
  "hapi-swagger": {
    security: [{ jwt: [] }],
    payloadType: "form",
    responses: {
      201: {
        description: "KYC successfully requested.",
      },
      400: {
        description: "Input fields error.",
      },
      401: {
        description: "Unauthorized",
      },
    },
  },
};

export const getAllKYCSwagger = {
  "hapi-swagger": {
    security: [{ jwt: [] }],
    responses: {
      200: {
        description: "Get KYCs successfully",
      },
      400: {
        description: "Request Param Error",
      },
      401: {
        description: "Unauthorized",
      },
    },
  },
};

export const getSingleKYCSwagger = {
  "hapi-swagger": {
    security: [{ jwt: [] }],
    responses: {
      200: {
        description: "Get single KYC successfully",
      },
      400: {
        description: "Request Param Error",
      },
      401: {
        description: "Unauthorized",
      },
      403: {
        description: "Permission Error",
      },
      404: {
        description: "KYC cannot find",
      },
    },
  },
};

export const updateKYCSwagger = {
  "hapi-swagger": {
    security: [{ jwt: [] }],
    responses: {
      200: {
        description: "KYC update successfully.",
      },
      400: {
        description: "Cannot update",
      },
      401: {
        description: "Unauthorized",
      },
      403: {
        description: "Permission error",
      },
      404: {
        description: "KYC cannot find",
      },
    },
  },
};

export const deleteKYCSwagger = {
  "hapi-swagger": {
    security: [{ jwt: [] }],
    responses: {
      200: {
        description: "Delete KYC successfully",
      },
      400: {
        description: "Request Param Error",
      },
      401: {
        description: "Unauthorized",
      },
      403: {
        description: "Permission Error",
      },
      404: {
        description: "KYC cannot find",
      },
    },
  },
};
