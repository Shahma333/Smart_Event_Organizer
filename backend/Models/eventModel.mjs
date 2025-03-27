import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, 
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    images: [
      {
          filename: String,
          description: String 
      }
  ],
    subtitles: [
      {
        title: { type: String, trim: true },
        image: { type: String }, 
        content: { type: String, trim: true }, 
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
   
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },
    public: {
      type: Boolean,
      default: false, 
    },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "tasks" }

    ]
  },
  {
    timestamps: true, 
  }
);


EventSchema.index({ status: 1 });

export const eventCollection = mongoose.model("events", EventSchema);
