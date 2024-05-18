import { Request, ResponseToolkit } from "@hapi/hapi";

import { getTransactionSchema } from "../validation/transaction";
import { getTransactionSwagger } from "../swagger/transaction";
import User from "../models/users";
import Transaction from "../models/transaction";

const options = { abortEarly: false, stripUnknown: true };
export let transactionRoute = [
  {
    method: "GET",
    path: "/all",
    options: {
      auth: "jwt",
      description: "Get all transactions by role with pagination",
      plugins: getTransactionSwagger,
      tags: ["api", "transaction"],
      validate: {
        query: getTransactionSchema,
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
        let { page, txType } = request.query;

        if (page === undefined) {
          page = 1;
        }

        if (txType === undefined) {
          txType = "all";
        }

        console.log("transaction history -->", page, txType);
        if (user.role === "investor") {
          const total = await Transaction.countDocuments({
            from: user.wallet.address,
          });
          const transactionWithProject = await Transaction.find({
            from: user.wallet.address,
            projectId: { $ne: null },
          })
            .populate("projectId")
            .sort({ createdAt: -1 })
            .exec();

          const transactionWithoutProject = await Transaction.find({
            from: user.wallet.address,
            projectId: null,
          })
            .sort({ createdAt: -1 })
            .exec();

          let result = transactionWithProject.concat(transactionWithoutProject);

          result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

          result = result.slice((page - 1) * 25, page * 25);
          return { total, data: result };
        } else if (user.role === "prowner") {
          let result = [];
          const total = await Transaction.countDocuments({
            from: user.wallet.address,
          });
          if (txType === "project") {
            const transactionWithProject = await Transaction.find({
              from: user.wallet.address,
              projectId: { $ne: null },
            })
              .populate("projectId")
              .skip((page - 1) * 25)
              .limit(25)
              .sort({ createdAt: -1 })
              .exec();
            result = transactionWithProject;
          } else {
            const transactionWithProject = await Transaction.find({
              $or: [{ from: user.wallet.address }, { to: user.wallet.address }],
              projectId: { $ne: null },
              value: { $ne: 0 },
            })
              .populate({
                path: "projectId",
                select: "name tokenization.tokenName contract",
                match: { deleted: false },
              })
              .sort({ createdAt: -1 })
              .exec();

            const transactionWithoutProject = await Transaction.find({
              $or: [{ from: user.wallet.address }, { to: user.wallet.address }],
              projectId: null,
              value: { $ne: 0 },
            })
              .sort({ createdAt: -1 })
              .exec();

            result = transactionWithProject.concat(transactionWithoutProject);

            result.sort(
              (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
            );

            result = result.slice((page - 1) * 25, page * 25);
          }
          return { total, data: result };
        } else {
          let result = [];
          const total = await Transaction.countDocuments({});
          if (txType === "project") {
            const transactionWithProject = await Transaction.find({
              projectId: { $ne: null },
            })
              .populate("projectId")
              .skip((page - 1) * 25)
              .limit(25)
              .sort({ createdAt: -1 })
              .exec();
            result = transactionWithProject;
          } else {
            const transactionWithProject = await Transaction.find({
              projectId: { $ne: null },
              value: { $ne: 0 },
            })
              .populate("projectId")
              .sort({ createdAt: -1 })
              .exec();

            const transactionWithoutProject = await Transaction.find({
              projectId: null,
              value: { $ne: 0 },
            })
              .sort({ createdAt: -1 })
              .exec();

            result = transactionWithProject.concat(transactionWithoutProject);

            result.sort(
              (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
            );

            result = result.slice((page - 1) * 25, page * 25);
          }
          return { total, data: result };
        }
      },
    },
  },
];
