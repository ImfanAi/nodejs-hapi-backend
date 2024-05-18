import mongoose from "mongoose";

const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    from: {
      type: String,
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "project",
    },
    value: {
      type: Number,
      required: true,
    },
    action: {
      type: String,
      reqruied: true,
    },
    txHash: {
      type: String,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("transaction", transactionSchema);
export default Transaction;
