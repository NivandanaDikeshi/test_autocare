import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
    vehicles: [
      {
        vehicleNumber: { type: String, uppercase: true, trim: true },
        vehicleModel: { type: String, trim: true },
      },
    ],
    totalBookings: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Customer =
  mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);

export default Customer;
