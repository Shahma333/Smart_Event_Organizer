import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { api } from "../axios";
import "bootstrap/dist/css/bootstrap.min.css"; 

const CreateEvent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { eventId } = useParams();
    const { user } = useSelector((state) => state.auth); 
    const eventName = location.state?.eventName || "";

    const [eventData, setEventData] = useState({
        name: eventName,
        date: "",
        location: "",
        description: "",
        image: null,
        createdBy: user?.id || "", 
    });

    const [role, setRole] = useState("");

    useEffect(() => {
        const userRole = localStorage.getItem("userRole");
        setRole(userRole);

        if (eventId) {
            fetchEventDetails(eventId);
        }
    }, [eventId]);

    const fetchEventDetails = async (id) => {
        try {
            const response = await api.get(`/events/get/${id}`);
            setEventData({
                name: response.data.event.name,
                date: response.data.event.date.split("T")[0],
                location: response.data.event.location,
                description: response.data.event.description || "",
                createdBy: response.data.event.createdBy, 
            });
        } catch (error) {
            console.error("Error fetching event details:", error);
        }
    };

    const handleChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setEventData({ ...eventData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");

            console.log("Sending event data:", eventData);

            const response = await api.post("/events/create", eventData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json" 
                },
            });

            console.log("Response:", response.data);
            alert("Event created successfully!");
            navigate("/events/getevents");
        } catch (error) {
            console.error("Error creating event:", error);
            console.log("Error Response:", error.response); 
            alert("Error creating event! " + (error.response?.data?.message || "Unknown error"));
        }
    };

    return (
        <div className="container create-event-container">
            <div className="card shadow p-4">
                <h2 className="text-center text-primary mb-4">
                    {eventId ? "Update Event" : "Create Event"}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Event Name</label>
                        <input
                            type="text"
                            name="name"
                            value={eventData.name}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={eventData.date}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={eventData.location}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-success w-100">
                        {eventId ? "Update Event" : "Create Event"}
                    </button>
                </form>
            </div>
        </div>
    );
};


const styles = `
.create-event-container {
    margin-top: 150px !important;
    max-width: 500px;
    padding: 20px;
}
`;
document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);

export default CreateEvent;
