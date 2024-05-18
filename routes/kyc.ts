import { Request, ResponseToolkit } from "@hapi/hapi";

import KYC from "../models/kycs";
import {
  getApplicant,
  getApplicantVerifStep,
  getImage,
  getAccessToken,
} from "../utils/sumsub";
import {
  getAllKYCSwagger,
  getSingleKYCSwagger,
  deleteKYCSwagger,
  updateKYCSwagger,
} from "../swagger/kyc";
import { getKYCSchema, updateKYCSchema } from "../validation/kyc";
import User from "../models/users";

const options = { abortEarly: false, stripUnknown: true };
export let kycRoute = [
  {
    method: "GET",
    path: "/all",
    options: {
      auth: "jwt",
      description: "Get all KYC with pagination, status and role",
      plugins: getAllKYCSwagger,
      tags: ["api", "kyc"],
      validate: {
        query: getKYCSchema,
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
        const authUser = await User.findById(request.auth.credentials.userId);

        if (authUser.role !== "admin")
          return response.response({ msg: "Permission Error" }).code(403);
        let { status, user, page } = request.query;
        let result,
          query = {};
        if (user) query["user.role"] = user;
        if (status) {
          query["reviewStatus"] = status;
        }
        if (page) {
          page = parseInt(page);
        } else page = 1;
        const lookup = {
          $lookup: {
            from: "users",
            localField: "externalUserId",
            foreignField: "_id",
            as: "user",
          },
        };
        const unwind = {
          $unwind: "$user",
        };
        const match = {
          $match: query,
        };
        const project = {
          $project: {
            "user.middleName": 0,
            "user._id": 0,
            "user.password": 0,
            "user.emailVerified": 0,
            "user.doneMilestones": 0,
            "user.transactions": 0,
            "user.otp": 0,
          },
        };
        const sort = {
          $sort: {
            createdAtMs: -1,
          },
        };
        const skip = {
          $skip: (page - 1) * 25,
        };
        const limit = {
          $limit: 25,
        };
        const group = {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        };
        const pipeline = [];
        pipeline.push(lookup, unwind);
        if (query) pipeline.push(match);
        pipeline.push(group);
        const countTotal: Array<Object> = await KYC.aggregate(pipeline);
        let total = 0;
        if (countTotal.length > 0) total = countTotal[0]["count"];
        pipeline.splice(3, 1);
        pipeline.push(sort, project, skip, limit);

        result = await KYC.aggregate(pipeline);
        return { total: total, data: result, offset: 25 * page };
      },
    },
  },
  {
    method: "GET",
    path: "/{applicantId}",
    options: {
      auth: "jwt",
      description: "Get an KYC by id",
      plugins: getSingleKYCSwagger,
      tags: ["api", "kyc"],
      handler: async (request: Request, response: ResponseToolkit) => {
        try {
          const applicant = await getApplicant(request.params.applicantId);
          const applicantVeriff = await getApplicantVerifStep(
            request.params.applicantId
          );
          try {
            return response.response({
              applicant,
              applicantVeriff,
            });
          } catch (error) {
            console.log(error);
          }
        } catch (error) {
          return response
            .response({ msg: "KYC not found with given id" })
            .code(404);
        }
      },
    },
  },
  {
    method: "GET",
    path: "/image/{inspectionId}/{imageId}",
    options: {
      auth: "jwt",
      description: "Get an KYC image",
      plugins: getSingleKYCSwagger,
      tags: ["api", "kyc"],
      handler: async (request: Request, response: ResponseToolkit) => {
        try {
          let image, buffer;
          const { inspectionId, imageId } = request.params;
          try {
            image = await getImage(inspectionId, imageId);
            buffer = Buffer.from(image, "binary");
            return response.response(buffer).type("arrayBuffer");
          } catch (error) {
            console.log(error);
          }
        } catch (error) {
          return response
            .response({ msg: "KYC image not found with given id" })
            .code(404);
        }
      },
    },
  },
  {
    method: "GET",
    path: "/websdk",
    options: {
      auth: "jwt",
      description: "Get an KYC by id",
      plugins: getSingleKYCSwagger,
      tags: ["api", "kyc"],
      handler: async (request: Request, response: ResponseToolkit) => {
        try {
          const accessToken = await getAccessToken(
            request.auth.credentials.userId
          );
          return response.response(accessToken);
        } catch (error) {
          console.log(error);
          return response
            .response({ msg: "KYC not found with given id" })
            .code(404);
        }
      },
    },
  },
  {
    method: "GET",
    path: "/current",
    options: {
      auth: "jwt",
      description: "Get an KYC by id",
      plugins: getSingleKYCSwagger,
      tags: ["api", "kyc"],
      handler: async (request: Request, response: ResponseToolkit) => {
        const user = await User.findById(request.auth.credentials.userId);
        if (user) {
          return response.response({ status: user.kycStatus });
        }
        return response.response({ msg: "User not found" }).code(404);
      },
    },
  },
  {
    method: "POST",
    path: "/hook",
    options: {
      description: "Hook KYC Change from Sumsub",
      tags: ["api", "kyc"],
    },
    handler: async (request: Request, response: ResponseToolkit) => {
      console.log(request.payload);
      const user = await User.findById(request.payload["externalUserId"]);
      if (user) {
        user.kycStatus = 1;
        if (request.payload["type"] === "applicantCreated") {
          const newKYC = new KYC(request.payload);
          newKYC.history.push({
            type: "Create",
            createdAt: newKYC.createdAtMs,
          });
          try {
            const result = await newKYC.save();
            await user.save();
            return response.response(result).code(201);
          } catch (error) {
            console.log(error);
            return response.response({ msg: "Error occurs" }).code(404);
          }
        }
        const kyc = await KYC.findOne({
          applicantId: request.payload["applicantId"],
        });
        if (kyc) {
          kyc.type = request.payload["type"];
          kyc.reviewStatus = request.payload["reviewStatus"];
          kyc.createdAtMs = request.payload["createdAtMs"];
          if (request.payload["reviewResult"])
            kyc.reviewResult = request.payload["reviewResult"];
          kyc.history.push({
            type: kyc.type,
            createdAt: kyc.createdAtMs,
          });
          if (
            kyc.type === "applicantReviewed" &&
            kyc.reviewStatus === "completed" &&
            kyc.reviewResult["reviewAnswer"] === "GREEN"
          ) {
            user.kycStatus = 2;
          }
          await kyc.save();
          await user.save();
          return response.response(kyc);
        }
        return response.response({ msg: "KYC not found" }).code(404);
      }
      return response.response({ msg: "User not found" }).code(404);
    },
  },
];
