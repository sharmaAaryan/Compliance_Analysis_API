import mongoose from "mongoose"; // MongoDB library
import { randomUUID } from "crypto"; // for unique ID

const companySchema = new mongoose.Schema(
  {
    // unique company ID
    uuid: {
      type: String,
      default: () => randomUUID(), // auto generate
      unique: true,
      index: true,
    },

    // company name
    legalName: {
      type: String,
      required: true, // must fill
      trim: true,
    },

    // database name (used in multi-tenant apps)
    dbaName: {
      type: String,
      required: true,
    },

    // address details
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },

    // main contact person
    primaryContact: {
      name: String,
      email: {
        type: String,
        lowercase: true, // convert to lowercase
        trim: true,
      },
    },

    phoneNumber: String, // phone
    website: String, // website link

    // who created this company
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth", // link to user
    },

    isActive: {
      type: Boolean,
      default: true, // active by default
    },

    deletedAt: {
      type: Date, // store delete time
      default: null,
    },

    // regulatory info
    identifiers: {
      fdafei: String, // FDA ID
      labellerCode: String,
      dunsNumber: String,

      cin: String, // India company ID
      gstin: String, // tax ID
      pan: String, // PAN

      cdsco: String, // drug authority
      others: String, // any extra
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
 },
);

// create model
export const Organization = mongoose.model("Organization", companySchema);