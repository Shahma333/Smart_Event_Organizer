import React, { useEffect, useState } from "react";
import { api } from "../axios";
import { Link } from "react-router-dom";
import moment from "moment";
import { useSelector } from "react-redux";

const ViewEvents = () => {
    const [events, setEvents] = useState([]);
    const { user, token } = useSelector((state) => state.auth);

   
    if (!user || !token) {
        console.error("❌ User or token is missing. Redirecting to login...");
        return <p>Redirecting to login...</p>;
    }

    useEffect(() => {
        fetchEvents();
    }, [user, token]);

    const fetchEvents = async () => {
        try {
            const response = await api.get("/events/getevents", {
                headers: { Authorization: `Bearer ${token}` },
            });

            let filteredEvents = response.data.events.map(event => ({
                ...event,
                date: moment(event.date).format("YYYY-MM-DD"), // Ensure proper date format
            }));
            

            if (user?.role === "user") {
                filteredEvents = filteredEvents.filter(event =>
                    event.createdBy?._id.toString() === user.id
                );
            }


            setEvents(filteredEvents);
        } catch (error) {
            console.error("Error fetching events:", error.response?.data?.message || error.message);
        }
    };

    const getEventStatus = (eventDate) => {
        console.log("Checking event date:", eventDate);
        
        const today = moment().startOf("day");
        const eventMoment = moment(eventDate).startOf("day");
    
        if (eventMoment.isBefore(today)) return "Completed";
        if (eventMoment.isSame(today)) return "Ongoing";
        return "Upcoming";
    };
    

    return (
        <div style={styles.container}>
            <h2>{user.role === "user" ? "My Events" : "All Events"}</h2>

            {user.role === "user" && (
                <Link to="/events/create" className="btn btn-success mb-3">
                    ➕ Create Event
                </Link>
            )}

            <ul style={styles.list}>
                {events.length === 0 ? (
                    <p>No events found.</p>
                ) : (
                    events.map((event) => {
                        const eventStatus = getEventStatus(event.date);
                        return (
                            <li key={event._id} style={styles.item}>
                                <h3>{event.name}</h3>
                                <p><strong>Date:</strong> {event.date ? moment(event.date).format("DD-MM-YYYY") : "No date"}</p>

                                <p><strong>Location:</strong> {event.location}</p>
                                <p>
                                    <strong>Status:</strong>
                                    <span className={`badge ${eventStatus === "Upcoming" ? "bg-primary" : eventStatus === "Ongoing" ? "bg-warning" : "bg-success"}`}>
                                        {eventStatus}
                                    </span>
                                </p>
                                <div className="d-flex justify-content-center gap-2">
                                    {user.role === "user" && (
                                        <>
                                           <Link
    to={eventStatus !== "Completed" ? `/events/update/${event._id}` : "#"}
    className="btn btn-primary btn-sm"
    style={{
        backgroundColor: eventStatus === "Completed" ? "#ccc" : "#007bff",
        cursor: eventStatus === "Completed" ? "not-allowed" : "pointer",
        border: "none",
        opacity: eventStatus === "Completed" ? 0.7 : 1,
        pointerEvents: eventStatus === "Completed" ? "none" : "auto", // Prevent clicking when disabled
    }}
>
    ✏️ Update
</Link>


                                            <Link to={`/events/delete/${event._id}`} className="btn btn-danger btn-sm">
                                                🗑️ Delete
                                            </Link>

                                            <Link to={`/events/${event._id}/guests`} className="btn btn-success btn-sm">
                                                👥 Manage Guests
                                            </Link>
                                        </>
                                    )}

                                    {user.role === "admin" && (
                                        <Link to={`/events/delete/${event._id}`} className="btn btn-danger btn-sm">
                                            🗑️ Delete
                                        </Link>
                                    )}

                                    <Link to={`/events/${event._id}/tasks`} className="btn btn-warning btn-sm text-dark">
                                        📋 Tasks
                                    </Link>

                                    {user.role === "user" && eventStatus === "Completed" && (
                                        <Link to={`/events/upload/${event._id}`} className="btn btn-info btn-sm">
                                            📷 Upload Image
                                        </Link>
                                    )}
                                </div>

                            </li>
                        );
                    })
                )}
            </ul>
        </div>
    );
};

// Styles
const styles = {
    container: { maxWidth: "800px", margin: "110px auto", padding: "20px", textAlign: "center" },
    list: { listStyleType: "none", padding: 0 },
    item: { background: "#f8f9fa", padding: "15px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ddd" },
};

export default ViewEvents;
