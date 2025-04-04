import express from "express";
import { createEvent, deleteEvent, deletePhoto, getAllEvents, getCompletedEvents, getEventById, updateEvent, uploadEventImage } from "../Controllers/eventController.mjs";
import { protect, authorize } from "../Middleware/Auth.mjs";  // ✅ Import authorize middleware
import multer from "multer"

import fs from "fs";
import path from "path";


const eventRouter = express.Router();


const uploadDir = path.join("uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Store images in "uploads" folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

eventRouter.post("/upload/:eventId", protect, upload.single("image"), uploadEventImage);

eventRouter.post("/create", protect, createEvent);
eventRouter.put("/update/:eventId", protect, authorize(["user"]), updateEvent);
eventRouter.delete("/delete/:eventId", protect, authorize(["user","admin"]), deleteEvent);
eventRouter.delete("/delete-image/:eventId/:imageId", protect, authorize(["user","coordinator"]), deletePhoto);

eventRouter.get("/getevents", protect, getAllEvents);

eventRouter.get("/get/:eventId", getEventById);
eventRouter.get("/completed-events", getCompletedEvents);
export default eventRouter;
