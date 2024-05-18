export const createProjectSwagger = {
  "hapi-swagger": {
    security: [{ jwt: [] }],
    payloadType: "form",
    responses: {
      201: {
        description: "Project successfully created.",
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

export const uploadDocumentsSwagger = {
  "hapi-swagger": {
    security: [{ jwt: [] }],
    payloadType: "form",
    responses: {
      201: {
        description: "Documents successfully uploaded.",
      },
      400: {
        description: "Uploading failed",
      },
      401: {
        description: "Unauthorized",
      },
    },
  },
};

export const getAllProjectSwagger = {
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

export const claimProjectSwagger = {
  "hapi-swagger": {
    security: [{ jwt: [] }],
    responses: {
      200: {
        description: "Claim successfully",
      },
      400: {
        description: "Request Param Error",
      },
      403: {
        description: "Permission Error",
      },
    },
  },
};

export const depositProjectSwagger = {
  "hapi-swagger": {
    security: [{ jwt: [] }],
    responses: {
      200: {
        description: "Deposit successfully",
      },
      400: {
        description: "Request Param Error",
      },
      403: {
        description: "Permission Error",
      },
    },
  },
};

export const withdrawProjectSwagger = {
  "hapi-swagger": {
    security: [{ jwt: [] }],
    responses: {
      200: {
        description: "Withdraw Saved successfully",
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
    },
  },
};

export const withdrawSubmitProjectSwagger = {
  "hapi-swagger": {
    security: [{ jwt: [] }],
    responses: {
      200: {
        description: "Withdraw successfully",
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
    },
  },
};

export const tokenizationProjectSwagger = {
  "hapi-swagger": {
    security: [{ jwt: [] }],
    responses: {
      200: {
        description: "Tokenization successfully",
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

export const allowProjectSwagger = {
  "hapi-swagger": {
    security: [{ jwt: [] }],
    responses: {
      200: {
        description: "Project Allowance Successfully",
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

export const getSingleProjectSwagger = {
  "hapi-swagger": {
    security: [{ jwt: [] }],
    responses: {
      200: {
        description: "Get single project successfully",
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
        description: "Project cannot find",
      },
    },
  },
};

export const updateProjectSwagger = {
  "hapi-swagger": {
    security: [{ jwt: [] }],
    responses: {
      200: {
        description: "Project update successfully.",
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
        description: "Project cannot find",
      },
    },
  },
};

export const deleteProjectSwagger = {
  "hapi-swagger": {
    security: [{ jwt: [] }],
    responses: {
      200: {
        description: "Delete Project successfully",
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
        description: "Project cannot find",
      },
    },
  },
};
