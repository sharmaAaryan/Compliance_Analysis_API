import mongoose from "mongoose";
import {randomUUID} from "crypto";

const frameworkSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: () => randomUUID(),
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      upperCase: true,
    },
    description: String,
    authority: {
      type: String,
    },
    country: String,
    appliesTo: {
      type: [String],
      enum: ["company", "product"],
    },
    industry: String,
    controls: {
      controlId: String,
      title: String,
      description: String,
      requirementText: String,
      mandatory: {
        type: Boolean,
        default: true,
      },
      riskLevel: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
      },
      tags: [String],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },
  },
  {timestamps: true},
);

export const Framework = mongoose.model("Framework", frameworkSchema);