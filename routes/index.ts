import { Server } from "@hapi/hapi";

import config from "../config";

import { kycRoute } from "./kyc";
import { userRoute } from "./user";
import { mileStoneRoute } from "./milestone";
import { projectRoute } from "./project";
import { transactionRoute } from "./transaction";
import { vesselRoute } from "./vessel";
import { investmentRoute } from "./investment";
import { depositRoute } from "./deposit";
import { chatRoute } from "./chat";
const prefix = `/api/${config.apiVersion}`;

const setRoutes = async (server: Server) => {
  server.realm.modifiers.route.prefix = `/api/${config.apiVersion}/user`;
  server.route(userRoute);

  server.realm.modifiers.route.prefix = `/api/${config.apiVersion}/kyc`;
  server.route(kycRoute);

  server.realm.modifiers.route.prefix = `/api/${config.apiVersion}/milestone`;
  server.route(mileStoneRoute);

  server.realm.modifiers.route.prefix = `/api/${config.apiVersion}/project`;
  server.route(projectRoute);

  server.realm.modifiers.route.prefix = `/api/${config.apiVersion}/transaction`;
  server.route(transactionRoute);

  server.realm.modifiers.route.prefix = `/api/${config.apiVersion}/vessel`;
  server.route(vesselRoute);

  server.realm.modifiers.route.prefix = `/api/${config.apiVersion}/invest`;
  server.route(investmentRoute);

  server.realm.modifiers.route.prefix = `/api/${config.apiVersion}/deposit`;
  server.route(depositRoute);

  server.realm.modifiers.route.prefix = `/api/${config.apiVersion}/chat`;
  server.route(chatRoute);
};
export default setRoutes;
