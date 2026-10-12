import mongoose from "mongoose";

const BillingSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      default: () => "INV-" + Date.now(),
    },
    bookingId: {
      type: String,
      default: "",
    },
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      default: "",
    },
    customerPhone: {
      type: String,
      default: "",
    },
    vehicleNumber: {
      type: String,
      required: true,
      uppercase: true,
    },
    vehicleModel: {
      type: String,
      default: "",
    },
    serviceType: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    spareParts: [
      {
        name: String,
        price: Number,
        quantity: { type: Number, default: 1 },
      },
    ],
    status: {
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Unpaid",
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Unpaid",
    },
    paymentMethod: {
      type: String,
      default: "Cash",
    },
    dueDate: {
      type: Date,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Sync amount and totalAmount, status and paymentStatus (Mongoose 8/9 synchronous hook without next)
BillingSchema.pre("save", function () {
  if (this.amount && !this.totalAmount) {
    this.totalAmount = this.amount;
  } else if (this.totalAmount && !this.amount) {
    this.amount = this.totalAmount;
  }
  if (this.status) {
    this.paymentStatus = this.status;
  }
});

const Billing =
  mongoose.models.Billing || mongoose.model("Billing", BillingSchema);

export default Billing;