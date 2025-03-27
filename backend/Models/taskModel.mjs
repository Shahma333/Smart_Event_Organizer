import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "events", // Reference to the Event model
    required: true,
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vendors",
    default: null,
  },
  eventDate: { type: Date },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed", "assigned"],
    default: "pending",
  },
}, { timestamps: true });

export const taskCollection = mongoose.model("tasks", TaskSchema);
