import { Request, ResponseToolkit } from "@hapi/hapi";

import { getAllChatUserSwagger } from "../swagger/chat";

import User from "../models/users";
import Chat from "../models/chat";

const options = { abortEarly: false, stripUnknown: true };
export let chatRoute = [
  {
    method: "GET",
    path: "/users",
    options: {
      auth: "jwt",
      description: "Get all chat user.",
      plugins: getAllChatUserSwagger,
      tags: ["api", "chat"],
      handler: async (request: Request, response: ResponseToolkit) => {
        const user = await User.findById(request.auth.credentials.userId);
        if (user.role === "admin") {
          const users = await User.find({ role: "investor" });
          return response.response({ users });
        }
        return response
          .response({ msg: "Invalid user list acccess!" })
          .code(400);
      },
    },
  },
  {
    method: "POST",
    path: "/insert",
    options: {
      auth: "jwt",
      description: "Get all chat user.",
      plugins: getAllChatUserSwagger,
      tags: ["api", "chat"],
      handler: async (request: Request, response: ResponseToolkit) => {
        const admin = await User.findOne({ role: "admin" });
        const user = await User.findById(request.auth.credentials.userId);
        console.log("chat request--------->", user);
        console.log("chat sent", request.payload);
        let savedData = Object.assign({}, request.payload["chat"]);
        if (user.role === "admin" && savedData["from"] !== "admin") {
          return response
            .response({ msg: "Invalid message request!" })
            .code(400);
        }
        if (
          user.role === "investor" &&
          (savedData["from"] !== user.email || savedData["to"] !== "admin")
        ) {
          return response
            .response({ msg: "Invalid message request!" })
            .code(400);
        }

        if (savedData["from"] === "admin") savedData["from"] = admin.email;
        else if (savedData["to"] === "admin") savedData["to"] = admin.email;
        const newChat = new Chat(savedData);
        await newChat.save();
        return response.response(newChat);
      },
    },
  },
  {
    method: "POST",
    path: "/filter",
    options: {
      auth: "jwt",
      description: "Get all chat user.",
      plugins: getAllChatUserSwagger,
      tags: ["api", "chat"],
      handler: async (request: Request, response: ResponseToolkit) => {
        const user = await User.findById(request.auth.credentials.userId);
        if (
          user.role === "admin" ||
          (user.role === "investor" && user.email === request.payload["user"])
        ) {
          const chatList = await Chat.find({
            $or: [
              { from: request.payload["user"] },
              { to: request.payload["user"] },
            ],
          });
          return chatList;
        }
        return response
          .response({ msg: "Invalid access to chat history!" })
          .code(400);
      },
    },
  },
];
