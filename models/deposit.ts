import mongoose from "mongoose";

const Schema = mongoose.Schema;

const depositSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  amount: {
    type: Number,
    required: true,
  },
  callback_url: {
    type: String,
    required: true,
  },
  expire: {
    type: Date,
    expires: 0,
  },
});

const Deposit = mongoose.model("deposit", depositSchema);
export default Deposit;
