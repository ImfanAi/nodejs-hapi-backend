import mongoose from "mongoose";

const Schema = mongoose.Schema;
const investmentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "project",
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Investment = mongoose.model("investment", investmentSchema);

const findInvestmentsNumberByProjectOwner = async (projectOwnerId) => {
  const objectId = new mongoose.Types.ObjectId(projectOwnerId);
  try {
    const result = await Investment.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "projects",
          localField: "projectId",
          foreignField: "_id",
          as: "project",
        },
      },
      {
        $unwind: "$project",
      },
      {
        $match: {
          "project.projectOwner": objectId,
        },
      },
      {
        $group: {
          _id: "$userId",
          count: { $sum: 1 },
          status: { $first: "$user.status" },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    let active, inactive;
    if (result[0]["_id"]) {
      active = result[0]["count"];
      inactive = result[1]["count"];
    } else {
      inactive = result[0]["count"];
      active = result[1]["count"];
    }
    return {
      total: active + inactive,
      active,
      inactive,
    };
  } catch (error) {
    console.error(error);
  }
};
export { findInvestmentsNumberByProjectOwner };
export default Investment;
