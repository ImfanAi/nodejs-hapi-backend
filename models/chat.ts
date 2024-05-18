import mongoose from "mongoose";

const Schema = mongoose.Schema;

const chatSchema = new Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  deleted: {
    from: {
      type: Boolean,
      default: false,
    },
    to: {
      type: Boolean,
      default: false,
    },
  },
  time: {
    type: Date,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
});

const Chat = mongoose.model("chat", chatSchema);
export default Chat;
