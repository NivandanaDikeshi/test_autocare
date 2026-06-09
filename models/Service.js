import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },

    vehicleNumber: {
      type: String,
      required: true,
    },

    serviceType: {
      type: String,
      required: true,
    },

    mechanic: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      default: "",
    },

    spareParts: [
      {
        partName: String,
        quantity: Number,
      },
    ],

    status: {
      type: String,
      enum: [
        "Received",
        "Checking",
        "Repairing",
        "Completed",
      ],
      default: "Received",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Service ||
  mongoose.model("Service", ServiceSchema);