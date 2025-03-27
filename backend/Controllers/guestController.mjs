import { guestCollection } from "../Models/guestModel.mjs";
import { eventCollection } from "../Models/eventModel.mjs";
import { sendNotification } from "./emailServices.mjs"; // ✅ Use imported function

export const addGuest = async (req, res) => {
    try {
        console.log("Received request:", req.body);

        const { eventId, name, email,phone } = req.body;
        if (!eventId || !name || !email || !phone) {
            return res.status(400).send({ message: "All fields are required" });
        }

        const event = await eventCollection.findById(eventId).populate("createdBy", "name email");

        if (!event) {
            return res.status(404).send({ message: "Event not found" });
        }

        const guest = await guestCollection.create({
            eventId,
            name,
            email,
            phone,
            status: "pending",
            addedBy: req.user ? req.user._id : "unknown",
        });

        console.log("Guest added:", guest);

        
        const organizerName = event.createdBy ? event.createdBy.name : "The Event Organizer";

        await sendNotification(
            guest.email,
            `You're Invited to ${event.name}! 🎉`, // ✅ Use event.name
            `<p>Hello ${guest.name},</p>
            <p>You are invited to <strong>${event.name}</strong> on <strong>${new Date(event.date).toDateString()}</strong> at <strong>${event.location}</strong>.</p>
            <p>Please confirm your attendance:</p>
            <a href="http://localhost:2030/api/guests/confirm/${guest._id}" 
               style="padding: 10px 20px; background-color: green; color: white; text-decoration: none;">Confirm</a>
            <a href="http://localhost:2030/api/guests/decline/${guest._id}" 
               style="padding: 10px 20px; background-color: red; color: white; text-decoration: none; margin-left: 10px;">Decline</a>
            <p>Looking forward to seeing you there!</p>
            <p>Best regards,<br><strong>${organizerName}</strong></p>`
        );
        

        res.status(201).send({ message: "Guest added and email sent successfully", guest });
    } catch (err) {
        console.error("Error in addGuest:", err);
        res.status(500).send({ message: "Internal Server Error" });
    }
};



export const getGuestsByEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const guests = await guestCollection.find({ eventId });

        if (!guests.length) {
            return res.status(404).send({ message: "No guests found for this event" });
        }

        
        const confirmedGuests = guests.filter(guest => guest.status === "confirmed").length;
        const pendingGuests = guests.filter(guest => guest.status === "pending").length;
        const declinedGuests = guests.filter(guest => guest.status === "declined").length;

        return res.status(200).send({
            message: "Guests fetched successfully",
            guests,
            monitoring: { confirmedGuests, pendingGuests, declinedGuests }
        });
    } catch (err) {
        return res.status(500).send({ message: err.message || "Internal Server Error" });
    }
};


export const updateGuestStatus = async (req, res) => {
    try {
        const { guestId } = req.params;
        const { status } = req.body;

        const updatedGuest = await guestCollection.findByIdAndUpdate(
            guestId,
            { status },
            { new: true }
        );

        if (!updatedGuest) {
            return res.status(404).send({ message: "Guest not found" });
        }

        const event = await eventCollection.findById(updatedGuest.eventId);
        if (!event || !event.createdBy?.email) {
            return res.status(400).send({ message: "Event host email not found" });
        }

        await sendNotification(
            event.createdBy.email,
            "Guest RSVP Update",
            `${updatedGuest.name} has updated their RSVP status to: ${status}`
        );

        return res.status(200).send({ message: "Guest status updated and host notified", updatedGuest });
    } catch (err) {
        return res.status(500).send({ message: err.message || "Internal Server Error" });
    }
};


export const deleteGuest = async (req, res) => {
    try {
        const { guestId } = req.params;

        const guest = await guestCollection.findById(guestId);
        if (!guest) {
            return res.status(404).send({ message: "Guest not found" });
        }

        await guestCollection.findByIdAndDelete(guestId);

        
        await sendNotification(
            guest.email,
            "Event Invitation Update",
            `Hello ${guest.name},\n\nYour invitation to the event has been withdrawn.`
        );

        return res.status(200).send({ message: "Guest removed and notified successfully" });
    } catch (err) {
        return res.status(500).send({ message: err.message || "Internal Server Error" });
    }
};
export const confirmGuest = async (req, res) => {
    try {
        const { guestId } = req.params;

       
        const guest = await guestCollection.findByIdAndUpdate(
            guestId,
            { status: "confirmed" },
            { new: true }
        );

        if (!guest) {
            return res.status(404).send({ message: "Guest not found" });
        }

        res.status(200).send({ message: "Your RSVP has been confirmed!", guest });
    } catch (err) {
        console.error("Error confirming guest:", err);
        res.status(500).send({ message: "Internal Server Error" });
    }
};
export const declineGuest = async (req, res) => {
    try {
        const { guestId } = req.params;


        const guest = await guestCollection.findByIdAndUpdate(
            guestId,
            { status: "declined" },
            { new: true }
        );

        if (!guest) {
            return res.status(404).send({ message: "Guest not found" });
        }

        res.status(200).send({ message: "You have declined the invitation.", guest });
    } catch (err) {
        console.error("Error declining guest:", err);
        res.status(500).send({ message: "Internal Server Error" });
    }
};
