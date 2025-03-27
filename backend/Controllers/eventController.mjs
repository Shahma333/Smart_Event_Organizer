import { eventCollection } from "../Models/eventModel.mjs";
import { userCollection } from "../Models/userModel.mjs";
import multer from "multer";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";


export const createEvent = async (req, res) => {
  try {
    const { name, date, location, description } = req.body;
    const createdBy = req.user._id;
    const userRole = req.user.role;

    let newEvent = { name, date, location, createdBy };

    if (userRole === "coordinator") {
      newEvent.description = description;
      newEvent.public = true;

      if (req.file) {
        newEvent.image = req.file.path; 
      }
    }

    const event = await eventCollection.create(newEvent);
    return res.status(201).json({ message: "Event created successfully", event });
  } catch (err) {
    console.error("Error creating event:", err);
    return res.status(500).json({ message: err.message || "Internal server error" });
  }
};
export const getAllEvents = async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user._id; 

    let events;
    
    if (userRole === "admin" || userRole === "coordinator") {
     
      events = await eventCollection
        .find()
        .populate({
          path: "tasks",
          populate: { path: "assignedTo", select: "name email role" },
        })
        .populate("createdBy", "name email") 
        .lean();
    } else {
     
      events = await eventCollection
        .find({ createdBy: userId })
        .populate({
          path: "tasks",
          populate: { path: "assignedTo", select: "name email role" },
        })
        .populate("createdBy", "name email")
        .lean();
    }

    console.log("Events with Tasks:", events); 

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events found" });
    }

    res.status(200).json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Failed to fetch events" });
    }
  }
};



export const getEventById = async (req, res) => {
    try {
        const { eventId } = req.params;

    
        if (!eventId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid Event ID format" });
        }

        const event = await eventCollection.findById(eventId).select("name date location images description");

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json(event);
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ message: "Server error" });
    }
};





export const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userRole = req.user.role;
    const userId = req.user._id;

    console.log("Received Update Request for Event ID:", eventId);

   
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid Event ID" });
    }

   
    const event = await eventCollection.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

   
    if (userRole === "user" && event.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this event" });
    }

  
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "No update data provided" });
    }

    
    const updatedEvent = await eventCollection.findByIdAndUpdate(
      eventId,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Event updated successfully", updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await eventCollection.findOneAndDelete({ _id: eventId, createdBy: req.user._id });

    if (!event) {
      return res.status(404).json({ message: "Event not found or unauthorized" });
    }

    return res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Internal server error" });
  }
};
export const getCompletedEvents = async (req, res) => {
  try {
      console.log("✅ Fetching completed events...");

      const today = new Date();

    
      const completedEvents = await eventCollection.find({
          date: { $lt: today } 
      }).sort({ date: -1 });

      if (completedEvents.length === 0) {
          console.log("⚠️ No completed events found.");
          return res.status(404).json({ message: "No completed events found." });
      }

      console.log(`✅ Found ${completedEvents.length} completed events.`);
      return res.status(200).json({ events: completedEvents });

  } catch (error) {
      console.error("❌ Error fetching completed events:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
  }
};






export const uploadEventImage = async (req, res) => {
  try {
      const { eventId } = req.params;
      const { description } = req.body;
      const event = await eventCollection.findById(eventId);

      if (!event) {
          return res.status(404).json({ message: "Event not found" });
      }

      const currentDate = new Date();
      const eventDate = new Date(event.date);
      if (eventDate > currentDate) {
          return res.status(403).json({ message: "You can only upload images after the event is completed" });
      }

      if (!req.file || !description.trim()) {
          return res.status(400).json({ message: "Image and description are required!" }); // ✅ Ensure both are required
      }

      
      event.images = event.images || []; 
event.images.push({ filename: req.file.filename, description });
await event.save();


      res.status(200).json({ message: "Image uploaded successfully!", imageUrl: req.file.filename });
  } catch (error) {
      res.status(500).json({ message: error.message || "Internal server error" });
  }
};


export const deletePhoto = async (req, res) => {
  const { eventId, imageId } = req.params;

    try {
        const event = await eventCollection.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

       
        const updatedImages = event.images.filter(img => img._id.toString() !== imageId);
        
        if (updatedImages.length === event.images.length) {
            return res.status(404).json({ message: "Image not found" });
        }

        event.images = updatedImages;
        await event.save();

        res.json({ message: "Image deleted successfully" });
    } catch (error) {
        console.error("Error deleting image:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


