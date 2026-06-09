import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Active",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Vehicle ||
  mongoose.model("Vehicle", VehicleSchema);