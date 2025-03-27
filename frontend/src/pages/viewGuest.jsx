import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../axios";

const GuestList = () => {
    const { eventId } = useParams();
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchGuests = async () => {
            try {
                const response = await api.get(`/guests/event/${eventId}`);
                setGuests(response.data.guests);
            } catch (err) {
                setError("Failed to load guests.");
            } finally {
                setLoading(false);
            }
        };
        fetchGuests();
    }, [eventId]);

    if (loading) return <p>Loading guests...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={styles.container}>
            <h2>Guest List</h2>
            {guests.length === 0 ? (
                <p>No guests found.</p>
            ) : (
                <ul style={styles.list}>
                    {guests.map((guest) => (
                        <li key={guest._id} style={styles.item}>
                            <p><strong>Name:</strong> {guest.name}</p>
                            <p><strong>Email:</strong> {guest.email}</p>
                            <p><strong>Phone:</strong> {guest.phone}</p>
                            <p><strong>Status:</strong> <span style={getStatusStyle(guest.status)}>{guest.status}</span></p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "600px",
        margin: "50px auto",
        padding: "20px",
        textAlign: "center"
    },
    list: {
        listStyleType: "none",
        padding: 0
    },
    item: {
        background: "#f8f9fa",
        padding: "15px",
        marginBottom: "10px",
        borderRadius: "5px",
        border: "1px solid #ddd"
    }
};

// ✅ Function to style status text
const getStatusStyle = (status) => {
    const colors = {
        pending: { color: "orange", fontWeight: "bold" },
        confirmed: { color: "green", fontWeight: "bold" },
        declined: { color: "red", fontWeight: "bold" }
    };
    return colors[status] || {};
};

export default GuestList;
