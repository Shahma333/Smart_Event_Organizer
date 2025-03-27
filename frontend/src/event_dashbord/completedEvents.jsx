import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../axios";
import "bootstrap/dist/css/bootstrap.min.css";

const CompletedEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);  
    const [error, setError] = useState(null);      
    const navigate = useNavigate();

    useEffect(() => {
        fetchCompletedEvents();
    }, []);

    const fetchCompletedEvents = async () => {
        try {
            const response = await api.get("/events/completed-events"); 
            setEvents(response.data.events);
            console.log("✅ Completed Events Data:", response.data.events);
        } catch (error) {
            console.error("❌ Error fetching completed events:", error);
            setError("Failed to fetch completed events. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleLearnMore = (eventId) => {
        navigate(`/event-details/${eventId}`);
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>🎉 Our Events</h2>

            {loading ? (
                <p style={styles.loading}>Loading events...</p>
            ) : error ? (
                <p style={styles.error}>{error}</p>
            ) : events.length > 0 ? (
                <div style={styles.eventGrid}>
                    {events.map((event) => (
                        <div key={event._id} style={styles.eventCard}>
                            <img
                                src={`http://localhost:2030/uploads/${event.images?.[0]?.filename || "default.jpg"}`}
                                alt="Event"
                                style={styles.eventThumbnail}
                                onError={(e) => (e.target.src = "default.jpg")} // ✅ Fallback image
                            />
                            <div style={styles.cardBody}>
                                <h5>{event.name}</h5>
                                <p><strong>📍 Location:</strong> {event.location}</p>
                                <p style={styles.description}>
                                
                                </p>
                                <button style={styles.button} onClick={() => handleLearnMore(event._id)}>
                                    Learn More
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p style={styles.noEvents}>No completed events found.</p>
            )}
        </div>
    );
};

const styles = {
    container: { maxWidth: "1200px", margin: "100px auto", padding: "20px" },
    title: { textAlign: "center", color: "#007bff" },
    eventGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginTop: "20px" },
    eventCard: { borderRadius: "12px", overflow: "hidden", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", transition: "transform 0.3s", cursor: "pointer" },
    eventThumbnail: { width: "100%", height: "200px", objectFit: "cover" },
    cardBody: { padding: "15px", textAlign: "center" },
    description: { fontSize: "14px", color: "#333", marginTop: "10px" },
    button: { width: "100%", padding: "10px", backgroundColor: "#17a2b8", color: "white", borderRadius: "5px", cursor: "pointer", fontSize: "16px", marginTop: "10px" },
    noEvents: { textAlign: "center", fontSize: "18px", marginTop: "20px", color: "#ff0000" },
    loading: { textAlign: "center", fontSize: "18px", marginTop: "20px", color: "#007bff" },
    error: { textAlign: "center", fontSize: "18px", marginTop: "20px", color: "#ff0000" },
};

export default CompletedEvents;
