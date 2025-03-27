import mongoose from "mongoose";

const GuestSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "events",
    required: true,
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  status: {
    type: String,
    enum: ["invited", "confirmed", "declined", "pending"], 
    default: "pending", 
  },
});

export const guestCollection = mongoose.model("guests", GuestSchema);
