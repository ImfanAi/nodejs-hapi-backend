import mongoose from "mongoose";

const Schema = mongoose.Schema;

const milestoneSchema = new Schema({
  action: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const MileStone = mongoose.model("milestone", milestoneSchema);
export default MileStone;
