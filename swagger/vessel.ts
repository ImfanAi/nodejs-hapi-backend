export const createVesselSwagger = {
  "hapi-swagger": {
    security: [{ jwt: [] }],
    responses: {
      201: {
        description: "Vessel created successfully.",
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

export const getAllVesselSwagger = {
  "hapi-swagger": {
    security: [{ jwt: [] }],
    responses: {
      200: {
        description: "Vessel get successfully.",
      },
      400: {
        description: "Get Vessel failed",
      },
      401: {
        description: "Unauthorized",
      },
    },
  },
};

export const getSingleVesselSwagger = {
  "hapi-swagger": {
    security: [{ jwt: [] }],
    responses: {
      200: {
        description: "Single Vessel get successfully.",
      },
      400: {
        description: "Get Vessel failed",
      },
      401: {
        description: "Unauthorized",
      },
    },
  },
};

export const updateVesselSwagger = {
  "hapi-swagger": {
    security: [{ jwt: [] }],
    responses: {
      200: {
        description: "Update Vessel successfully.",
      },
      400: {
        description: "Update Vessel failed",
      },
      401: {
        description: "Unauthorized",
      },
    },
  },
};

export const deleteVesselSwagger = {
  "hapi-swagger": {
    security: [{ jwt: [] }],
    responses: {
      200: {
        description: "Delete Vessel successfully.",
      },
      400: {
        description: "Delete Vessel failed",
      },
      401: {
        description: "Unauthorized",
      },
      403: {
        description: "Permission denied",
      },
    },
  },
};
