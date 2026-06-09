import mongoose from "mongoose";

const BillingSchema = new mongoose.Schema(
  {
    bookingId: String,
    customerName: String,
    customerEmail: String,
    vehicleNumber: String,
    serviceType: String,
    amount: Number,
    status: {
      type: String,
      default: "Paid",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Billing ||
  mongoose.model("Billing", BillingSchema);