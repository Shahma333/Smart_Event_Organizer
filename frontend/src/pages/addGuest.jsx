import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../axios";

const AddGuest = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const [guestData, setGuestData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setGuestData({ ...guestData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await api.post("/guests/add", { ...guestData, eventId });
            setMessage(response.data.message);
            setTimeout(() => navigate(`/events/${eventId}/guests/view`), 1500);
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to add guest. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2>Add Guest</h2>
            {message && <p style={styles.message}>{message}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    name="name"
                    placeholder="Guest Name"
                    value={guestData.name}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Guest Email"
                    value={guestData.email}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Guest Phone"
                    value={guestData.phone}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? "Adding..." : "Add Guest"}
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "400px",
        margin: "100px auto",
        padding: "20px",
        textAlign: "center",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    input: {
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
    },
    button: {
        backgroundColor: "#007bff",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        cursor: "pointer",
        border: "none",
    },
    message: {
        color: "green",
        fontWeight: "bold",
    },
};

export default AddGuest;
