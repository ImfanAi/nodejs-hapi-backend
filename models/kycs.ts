import mongoose, { Mongoose, Types } from "mongoose";

const Schema = mongoose.Schema;

const kycSchema = new Schema({
  applicantId: {
    type: String,
    required: true,
  },
  inspectionId: {
    type: String,
    required: true,
  },
  correlationId: {
    type: String,
    required: true,
  },
  externalUserId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  type: {
    type: String,
    required: true,
  },
  reviewStatus: {
    type: String,
    required: true,
  },
  createdAtMs: {
    type: Date,
    required: true,
  },
  reviewResult: {
    type: Object,
  },
  history: [
    {
      type: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        required: true,
      },
    },
  ],
  status: {
    type: Number,
    default: 0,
  },
});

const KYC = mongoose.model("kyc", kycSchema);

export default KYC;
