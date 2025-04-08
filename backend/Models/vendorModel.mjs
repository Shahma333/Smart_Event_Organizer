import mongoose from "mongoose";

const VendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
     
    },
    phone: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    assignedTasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tasks",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const vendorCollection = mongoose.model("vendors", VendorSchema);
