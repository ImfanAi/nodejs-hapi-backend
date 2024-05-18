import { Request, ResponseToolkit } from "@hapi/hapi";
import Investment from "../models/investments";
import User from "../models/users";
import Project from "../models/projects";

import {
  getBalance,
  getClaimableAmount,
  getClaimedRewards,
  getFundraising,
  getGivenRewards,
  getAssets,
  invest,
} from "../utils/blockchain/project";

import { investSchema, getInvestmentSchema } from "../validation/investment";

import { investSwagger, getInvestmentSwagger } from "../swagger/investment";

const options = { abortEarly: false, stripUnknown: true };
export let investmentRoute = [
  {
    method: "POST",
    path: "/",
    options: {
      auth: "jwt",
      description: "Investment on project",
      plugins: investSwagger,
      tags: ["api", "user"],
      validate: {
        payload: investSchema,
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
    },
    handler: async (request: Request, response: ResponseToolkit) => {
      try {
        const payload = {
          userId: request.auth.credentials.userId,
          projectId: request.payload["projectId"],
          amount: request.payload["amount"],
        };
        console.log("----investment here----");
        const user = await User.findById(payload.userId);

        const investResult = await invest(
          payload.projectId,
          user.wallet.id,
          user.wallet.address,
          payload.amount
        );

        if (investResult) {
          console.log("investment payload -->", payload);
          console.log("investment result -->", investResult);

          const project = await Investment.findOne({
            userId: payload.userId,
            projectId: payload.projectId,
          });
          if (project) {
            project.amount += payload.amount;
            await project.save();
          } else {
            const newInvest = new Investment(payload);
            await newInvest.save();
          }
          return response.response({ msg: "Invest success" }).code(201);
        } else {
          return response.response({ msg: "Invest failed." }).code(400);
        }
      } catch (error) {
        console.log(error);
        return response.response({ msg: "Invest failed" }).code(500);
      }
    },
  },
  {
    method: "GET",
    path: "/",
    options: {
      auth: "jwt",
      description:
        "Get investment with pagination, userId, projectId, status, page",
      plugins: getInvestmentSwagger,
      tags: ["api", "kyc"],
      validate: {
        query: getInvestmentSchema,
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
        const user = await User.findById(userId);
        var totalAmount = 0;
        var totalClaimed = 0;
        var totalClaimable = 0;

        if (user.role === "investor") {
          const projectIds = await Project.find({});
          const investorAddress = user.wallet.address;
          const result: any[] = [];
          for (let i = 0; i < projectIds.length; i++) {
            const row = projectIds[i];

            if (row.allowance !== 1) continue;

            const shares = await getBalance(
              row._id.toString(),
              investorAddress
            );
            if (Number(shares) === 0) continue;

            const amount = await getAssets(row._id.toString(), investorAddress);
            if (Number(amount) === 0) continue;

            const claimed = await getClaimedRewards(
              row._id.toString(),
              investorAddress
            );

            const claimable = await getClaimableAmount(
              row._id.toString(),
              investorAddress
            );

            totalAmount += Number(amount);
            totalClaimed += Number(claimed);
            totalClaimable += Number(claimable);

            console.log("shares------------>", shares);
            result.push({
              project: row,
              amount,
              price:
                row.tokenization.assetValue / row.tokenization.tonnage / 1000,
              claimedRewards: claimed,
              claimableRewards: claimable,
            });
          }

          return {
            total: {
              investment: totalAmount,
              claimed: totalClaimed,
              claimable: totalClaimable,
            },
            data: result,
          };
        }
        if (user.role === "prowner") {
          const projectIds = await Project.find({ projectOwner: userId });
          var totalFundraising = 0;
          var totalRewards = 0;
          const result: any[] = [];

          for (let i = 0; i < projectIds.length; i++) {
            const project = projectIds[i];

            const fundraising = await getFundraising(project._id.toString());
            const givenRewards = await getGivenRewards(project._id.toString());

            totalFundraising += Number(fundraising);
            totalRewards += Number(givenRewards);

            result.push({
              project,
              fundraising,
              givenRewards,
            });
          }

          return {
            data: result,
            total: { fundraising: totalFundraising, rewards: totalRewards },
          };
        }
        return response
          .response({ msg: "You have no permission to access." })
          .code(403);
      },
    },
  },
];
