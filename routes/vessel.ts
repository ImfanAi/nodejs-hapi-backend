import { Request, ResponseToolkit } from "@hapi/hapi";

import {
  createVesselSwagger,
  getAllVesselSwagger,
  getSingleVesselSwagger,
  updateVesselSwagger,
  deleteVesselSwagger,
} from "../swagger/vessel";

import Vessel from "../models/vessels";
import User from "../models/users";

import { vesselRegisterSchema, vesselUpdateSchema } from "../validation/vessel";
import { UpdateVesselPayload } from "../interfaces";

const options = { abortEarly: false, stripUnknown: true };
export let vesselRoute = [
  {
    method: "POST",
    path: "/register",
    options: {
      auth: "jwt",
      description: "Create vessel.",
      plugins: createVesselSwagger,
      tags: ["api", "vessel"],
      validate: {
        payload: vesselRegisterSchema,
        options,
        failAction: (request, h, error) => {
          const details = error.details.map((d) => {
            return {
              message: d.message,
              path: d.path,
            };
          });
          return h.response(details).code(400).takeover();
        },
      },
      handler: async (request: Request, response: ResponseToolkit) => {
        const userId = request.auth.credentials.userId;
        const authUser = await User.findById(userId);
        if (authUser.role === "admin") {
          const vessel = new Vessel(request.payload);
          const saved = await vessel.save();
          return response
            .response({ msg: "Vessel created successfully." })
            .code(201);
        }
        return response.response({ msg: "Cannot create vessel" }).code(400);
      },
    },
  },
  {
    method: "GET",
    path: "/all",
    options: {
      auth: "jwt",
      description: "Get all vessel.",
      plugins: getAllVesselSwagger,
      tags: ["api", "vessel"],
      handler: async (request: Request, response: ResponseToolkit) => {
        const vessels = await Vessel.find();
        return response.response(vessels);
      },
    },
  },
  {
    method: "GET",
    path: "/{id}",
    options: {
      auth: "jwt",
      description: "Get a single vessel.",
      plugins: getSingleVesselSwagger,
      tags: ["api", "vessel"],
      handler: async (request: Request, response: ResponseToolkit) => {
        const vessel = await Vessel.findById(request.params.id);
        return response.response(vessel);
      },
    },
  },
  {
    method: "PUT",
    path: "/{id}",
    options: {
      auth: "jwt",
      description: "Update a single vessel.",
      plugins: updateVesselSwagger,
      tags: ["api", "vessel"],
      validate: {
        payload: vesselUpdateSchema,
        options,
        failAction: (request, h, error) => {
          const details = error.details.map((d) => {
            return {
              message: d.message,
              path: d.path,
            };
          });
          return h.response(details).code(400).takeover();
        },
      },
      handler: async (request: Request, response: ResponseToolkit) => {
        const user = await User.findById(request.auth.credentials.userId);
        if (user.role === "admin") {
          const payload = request.payload as UpdateVesselPayload;
          const vessel = await Vessel.findById(request.params.id);
          if (vessel) {
            const result = await Vessel.findOneAndUpdate(
              { _id: request.params.id },
              { $set: payload },
              { new: true }
            );
            return response.response({ msg: "Successfully updated." });
          }
          return response.response({ msg: "Cannot update vessel" }).code(400);
        }
        return response
          .response({ msg: "You don't have permission to update." })
          .code(403);
      },
    },
  },
  {
    method: "DELETE",
    path: "/{id}",
    options: {
      auth: "jwt",
      description: "Delete a single vessel.",
      plugins: deleteVesselSwagger,
      tags: ["api", "vessel"],
      handler: async (request: Request, response: ResponseToolkit) => {
        const user = await User.findById(request.auth.credentials.userId);
        if (user.role === "admin") {
          const vessel = await Vessel.findOneAndDelete(request.params.id);
          return response.response({ msg: "Vessel deleted successfully" });
        }
        return response
          .response({ msg: "You don't have permission to delete." })
          .code(403);
      },
    },
  },
];
