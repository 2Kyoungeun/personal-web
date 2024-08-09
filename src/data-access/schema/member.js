import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    pwd: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  {
    collection: "Member",
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    versionKey: false,
  }
);

export default memberSchema;
