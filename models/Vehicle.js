import mongoose from "mongoose";

const VehicleSchema = new mongoose.Schema(
  {
    ownerName: {
      type: String,
      default: "",
      trim: true,
    },
    ownerPhone: {
      type: String,
      default: "",
      trim: true,
    },
    name: {
      type: String,
      default: "",
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    number: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    year: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "In Service", "Completed", "Inactive"],
    },
  },
  { timestamps: true }
);

const Vehicle =
  mongoose.models.Vehicle || mongoose.model("Vehicle", VehicleSchema);

export default Vehicle;