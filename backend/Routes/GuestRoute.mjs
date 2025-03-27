import express from "express";
import { addGuest, confirmGuest, declineGuest, deleteGuest, getGuestsByEvent, updateGuestStatus } from "../Controllers/guestController.mjs";
import { protect } from "../Middleware/Auth.mjs";


const guestRouter = express.Router();
guestRouter.post("/add", protect, addGuest);
guestRouter.get("/event/:eventId", protect, getGuestsByEvent)


guestRouter.put("/:guestId", protect, updateGuestStatus);

guestRouter.delete("/:guestId", protect, deleteGuest);

export default guestRouter;
