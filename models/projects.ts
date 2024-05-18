import mongoose from "mongoose";

const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    projectOwner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    projectName: {
      type: String,
      required: true,
    },
    projectImage: {
      type: String,
    },
    documents: {
      technicalReport: {
        type: String,
      },
      financialReport: {
        type: String,
      },
      commercialReport: {
        type: String,
      },
      risk: {
        type: String,
      },
      community: {
        type: String,
      },
      vesselCertificate: {
        type: String,
      },
      detail: {
        type: String,
      },
    },
    description: {
      type: String,
      required: true,
    },
    imoNumber: {
      type: Number,
      required: true,
    },
    vesselType: {
      type: String,
      required: true,
    },
    builtYear: {
      type: Date,
      required: true,
    },
    flag: {
      type: String,
      required: true,
    },
    estimatedEarning: {
      type: Number,
      required: true,
    },
    tokenized: {
      type: Boolean,
      default: false,
    },
    tokenization: {
      type: Object,
      required: false,
      tokenName: {
        type: String,
        required: true,
      },
      tokenSymbol: {
        type: String,
        required: true,
      },
      decimal: {
        type: Number,
        required: true,
      },
      tonnage: {
        type: Number,
        required: true,
      },
      assetValue: {
        type: Number,
        required: true,
      },
      tokenizingPercentage: {
        type: Number,
        required: true,
      },
      offeringPercentage: {
        type: Number,
        required: true,
      },
      minimumInvestment: {
        type: Number,
        required: true,
      },
    },
    fundSTDate: {
      type: Date,
    },
    fundEDDate: {
      type: Date,
    },
    tradingSTDate: {
      type: Date,
    },
    tradingEDDate: {
      type: Date,
    },
    isSTOLaunched: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Boolean,
      default: true,
    },
    allowance: {
      type: Number,
      default: 0,
    },
    contract: {
      type: String,
    },
    projectType: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("project", projectSchema);

export default Project;
