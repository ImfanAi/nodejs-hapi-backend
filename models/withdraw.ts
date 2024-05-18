import mongoose from "mongoose";

const Schema = mongoose.Schema;

const withdrawSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "project",
    },
    allowance: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const WithDraw = mongoose.model("withDraw", withdrawSchema);
export default WithDraw;
