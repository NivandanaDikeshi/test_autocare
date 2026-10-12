import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    vehicleNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    serviceType: {
      type: String,
      required: true,
      trim: true,
    },
    mechanic: {
      type: String,
      default: "Unassigned",
      trim: true,
    },
    notes: {
      type: String,
      default: "",
    },
    spareParts: [
      {
        partName: String,
        quantity: { type: Number, default: 1 },
        price: { type: Number, default: 0 },
      },
    ],
    cost: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Received", "Checking", "Repairing", "Completed"],
      default: "Received",
    },
  },
  {
    timestamps: true,
  }
);

const Service =
  mongoose.models.Service || mongoose.model("Service", ServiceSchema);

export default Service;