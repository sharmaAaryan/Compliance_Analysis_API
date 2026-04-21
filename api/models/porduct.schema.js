          import mongoose from "mongoose";
import {randomUUID} from "crypto";

const productSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: () => randomUUID(),
      unique: true,
      index: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },

    // Basic Info
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    productCode: String,
    description: String,
    productType: {
      type: String,
      enum: [
        "drug",
        "medical_device",
        "software",
        "ai_system",
        "diagonistic",
        "other",
      ],
    },
    images: [
      {
        url: String,
        publicId: String,
        label: String,
      },
    ],
  },
  {timestamps: true},
);

export const Product = mongoose.model("Product", productSchema);