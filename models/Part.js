import mongoose from "mongoose";

const PartSchema = new mongoose.Schema(
  {
    partName: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
    },

    price: {
      type: Number,
      required: true,
    },

    supplier: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Part ||
  mongoose.model("Part", PartSchema);