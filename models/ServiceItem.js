import mongoose from "mongoose";

const ServiceItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      default: "General Service",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    estimatedTime: {
      type: String,
      default: "1-2 Hours",
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    longDescription: {
      type: String,
      default: "",
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    image: {
      type: String,
      default: "/images/services/maintenance.jpg",
    },
    popular: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ServiceItem =
  mongoose.models.ServiceItem ||
  mongoose.model("ServiceItem", ServiceItemSchema);

export default ServiceItem;
