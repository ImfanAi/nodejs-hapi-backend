import mongoose from "mongoose";

const Schema = mongoose.Schema;

const vesselSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Vessel = mongoose.model("vessel", vesselSchema);
export default Vessel;
