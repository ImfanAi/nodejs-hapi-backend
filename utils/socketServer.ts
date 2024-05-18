import { Server } from "socket.io";
import User from "../models/users";

const registerSocketServer = async (server) => {
  const admin = await User.findOne({ role: "admin" });
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    console.log(`user connected ${socket.id}`);
    socket.on("login", async (data) => {
      const user = await User.findOne({ email: data });
      if (user) {
        if (user.role === "admin") {
          socket["role"] = 0;
          console.log("admin has joined in help room");
        } else {
          socket["role"] = 1;
          console.log(data + "logged in help room");
        }
        socket["email"] = user.email;
        socket.join(user.email);
      }
    });
    socket.on("newMessage", (data) => {
      console.log(data);
      console.log(socket["role"]);
      if (data["to"] !== "admin")
        io.to(data["to"]).emit("messageFromServer", data);
      else io.to(data["from"]).emit("messageFromServer", data);
    });
    socket.on("currentUser", (data) => {
      console.log(data);
      socket.leave(socket["currentUser"]);
      socket["currentUser"] = data;
      socket.join(data);
    });
    socket.on("disconnect", () => {
      console.log(socket["email"] + " disconnected");
    });
  });
};

export default registerSocketServer;
