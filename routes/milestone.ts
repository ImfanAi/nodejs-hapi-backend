import { Request, ResponseToolkit } from "@hapi/hapi";

import {
  createMileStoneSwagger,
  getAllMilestoneSwagger,
  getSingleMilestoneSwagger,
  updateMileStoneSwagger,
  deleteMileStoneSwagger,
} from "../swagger/milestone";
import MileStone from "../models/milestones";
import User from "../models/users";
import {
  milestoneRegisterSchema,
  milestoneUpdateSchema,
} from "../validation/milestone";
import { UpdateMilestonePayload } from "../interfaces";

const options = { abortEarly: false, stripUnknown: true };
export let mileStoneRoute = [
  {
    method: "POST",
    path: "/register",
    options: {
      auth: "jwt",
      description: "Create milestone.",
      plugins: createMileStoneSwagger,
      tags: ["api", "milestone"],
      validate: {
        payload: milestoneRegisterSchema,
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
          const milestone = new MileStone(request.payload);
          const saved = await milestone.save();
          return response
            .response({ msg: "Milestone created successfully." })
            .code(201);
        }
        return response.response({ msg: "Cannot create milestone" }).code(400);
      },
    },
  },
  {
    method: "GET",
    path: "/all",
    options: {
      auth: "jwt",
      description: "Get all milestone.",
      plugins: getAllMilestoneSwagger,
      tags: ["api", "milestone"],
      handler: async (request: Request, response: ResponseToolkit) => {
        const milestones = await MileStone.find();
        return response.response(milestones);
      },
    },
  },
  {
    method: "GET",
    path: "/{id}",
    options: {
      auth: "jwt",
      description: "Get a single milestone.",
      plugins: getSingleMilestoneSwagger,
      tags: ["api", "milestone"],
      handler: async (request: Request, response: ResponseToolkit) => {
        const milestones = await MileStone.findById(request.params.id);
        return response.response(milestones);
      },
    },
  },
  {
    method: "PUT",
    path: "/{id}",
    options: {
      auth: "jwt",
      description: "Update a single milestone.",
      plugins: updateMileStoneSwagger,
      tags: ["api", "milestone"],
      validate: {
        payload: milestoneUpdateSchema,
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
          const payload = request.payload as UpdateMilestonePayload;
          const milestone = await MileStone.findById(request.params.id);
          if (milestone) {
            const result = await MileStone.findOneAndUpdate(
              { _id: request.params.id },
              { $set: payload },
              { new: true }
            );
            return response.response({ msg: "Successfully updated." });
          }
          return response
            .response({ msg: "Cannot update milestone" })
            .code(400);
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
      description: "Delete a single milestone.",
      plugins: deleteMileStoneSwagger,
      tags: ["api", "milestone"],
      handler: async (request: Request, response: ResponseToolkit) => {
        const user = await User.findById(request.auth.credentials.userId);
        if (user.role === "admin") {
          const milestone = await MileStone.findOneAndDelete(request.params.id);
          return response.response({ msg: "Milestone deleted successfully" });
        }
        return response
          .response({ msg: "You don't have permission to delete." })
          .code(403);
      },
    },
  },
];
