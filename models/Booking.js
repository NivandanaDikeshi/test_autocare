import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    vehicleModel: {
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
    },

    preferredDate: {
      type: String,
      required: true,
    },

    preferredTime: {
      type: String,
      required: true,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
    },
  },
  {
    timestamps: true,
  }
);

// FIX: Prevent model overwrite error in Next.js hot reload
const Booking =
  mongoose.models.Booking || mongoose.model("Booking", BookingSchema);

export default Booking;