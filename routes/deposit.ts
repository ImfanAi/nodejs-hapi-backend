import { Request, ResponseToolkit } from "@hapi/hapi";
import { createDepositSwagger, ipnSwagger } from "../swagger/deposit";

import Deposit from "../models/deposit";
import User from "../models/users";
import { createWallet } from "../utils/venly";

import { depositSchema, ipnSchema } from "../validation/deposit";
import { createTransaction } from "../utils/coinpayment";
import { distribute } from "../utils/blockchain/musd";

const options = { abortEarly: false, stripUnknown: true };
const client = require("stripe")(process.env.STRIPE_SECRET_KEY);

export let depositRoute = [
  {
    method: "POST",
    path: "/",
    options: {
      auth: "jwt",
      description: "Create deposit",
      plugins: createDepositSwagger,
      tags: ["api", "vessel"],
      validate: {
        payload: depositSchema,
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
        if (user.wallet.address === "") {
          const wallet = await createWallet();
          console.log(wallet);
          user.wallet.address = wallet.result.address;
          user.wallet.id = wallet.result.id;
          user.firstAction = true;

          await user.save();
        }
        const query = {
          userId: user._id,
          amount: request.payload["amount"],
        };
        const traHistory = await Deposit.find(query);
        if (traHistory.length !== 0) {
          return traHistory[0];
        }

        const baseUrl = `${request.server.info.protocol}://${request.info.host}`;
        const ipn_url = `${baseUrl}/api/v1/deposit/ipn/${user._id}/${query.amount}`;
        console.log(ipn_url);
        const transaction = await createTransaction(
          ipn_url,
          user.email,
          "USD",
          "ETH",
          query.amount,
          "0x13E889cB6472C1FFE1782A7B0CbeF81DfF839828"
        );
        console.log(transaction);
        const newDeposit = new Deposit({
          userId: user._id,
          amount: request.payload["amount"],
          callback_url: transaction["checkout_url"],
          expire: Date.now() + transaction["timeout"] * 1000,
        });
        await newDeposit.save();
        return newDeposit;
      },
    },
  },
  {
    method: "POST",
    path: "/ipn/{userId}/{amount}",
    options: {
      description: "Handle IPN",
      plugins: ipnSwagger,
      tags: ["api", "vessel"],
      validate: {
        params: ipnSchema,
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
        const query = {
          userId: request.params["userId"],
          amount: request.params["amount"],
        };
        const traHistory = await Deposit.find(query);
        const user = await User.findById(query.userId);
        if (traHistory.length !== 0) {
          if (request.payload["status"] == 100) {
            try {
              await distribute(user.wallet.address, query.amount);
              await traHistory[0].deleteOne();
            } catch (error) {
              console.log(error);
            }
            return response.response("Deposit Success");
          }
          return response.response({ msg: "Deposit failed" }).code(400);
        }
        return response.response({ msg: "Deposit can't find" }).code(404);
      },
    },
  },
  {
    method: "POST",
    path: "/stripe/webhook",
    handler: async (request: Request, response: ResponseToolkit) => {
      console.log(request.payload["type"]);
      const sig = request.headers["stripe-signature"];

      if (request.payload["type"] === "charge.succeeded") {
        const cus_id = request.payload["data"]["object"]["customer"];
        const amount = request.payload["data"]["object"]["amount"];
        console.log(cus_id);
        const user = await User.findOne({ cus_id: cus_id });

        if (user.wallet.address === "") {
          const wallet = await createWallet();
          console.log(wallet);
          user.wallet.address = wallet.result.address;
          user.wallet.id = wallet.result.id;

          await user.save();
        }
        try {
          await distribute(user.wallet.address, amount / 100);
        } catch (error) {
          console.log(error);
        }
        console.log(request.payload["data"]["object"]["receipt_url"]);
        return response.response("Success");
      }
      return response.response("Handle Not Charing");
    },
  },
];
