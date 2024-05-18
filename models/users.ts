import mongoose from "mongoose";

const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    password: {
      type: String,
    },
    referralCode: {
      type: String,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    kycStatus: {
      type: Number,
      default: 0,
    },
    status: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["investor", "prowner", "admin"],
    },
    cus_id: {
      type: String,
    },
    doneMilestones: [
      {
        milestoneId: {
          type: Schema.Types.ObjectId,
          ref: "milestone",
        },
      },
    ],
    otp: {
      type: String,
    },
    transactions: [
      {
        transactionId: {
          type: Schema.Types.ObjectId,
          ref: "transaction",
        },
      },
    ],
    wallet: {
      id: {
        type: String,
        default: "",
      },
      address: {
        type: String,
        default: "",
      },
    },
    emailVerifyToken: {
      type: String,
      required: true,
    },
    emailVerifyExpire: {
      type: Number,
      required: true,
    },
    firstAction: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
export default User;
