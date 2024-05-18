export const createMileStoneSwagger = {
  "hapi-swagger": {
    security: [{ jwt: [] }],
    responses: {
      201: {
        description: "Milestone created successfully.",
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

export const getAllMilestoneSwagger = {
  "hapi-swagger": {
    security: [{ jwt: [] }],
    responses: {
      200: {
        description: "Milestone get successfully.",
      },
      400: {
        description: "Get milestone failed",
      },
      401: {
        description: "Unauthorized",
      },
    },
  },
};

export const getSingleMilestoneSwagger = {
  "hapi-swagger": {
    security: [{ jwt: [] }],
    responses: {
      200: {
        description: "Single Milestone get successfully.",
      },
      400: {
        description: "Get milestone failed",
      },
      401: {
        description: "Unauthorized",
      },
    },
  },
};

export const updateMileStoneSwagger = {
  "hapi-swagger": {
    security: [{ jwt: [] }],
    responses: {
      200: {
        description: "Update milestone successfully.",
      },
      400: {
        description: "Update milestone failed",
      },
      401: {
        description: "Unauthorized",
      },
    },
  },
};

export const deleteMileStoneSwagger = {
  "hapi-swagger": {
    security: [{ jwt: [] }],
    responses: {
      200: {
        description: "Delete milestone successfully.",
      },
      400: {
        description: "Delete milestone failed",
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
