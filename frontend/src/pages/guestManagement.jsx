import React from "react";
import { useParams, Link } from "react-router-dom";

const GuestManagement = () => {
    const { eventId } = useParams();

    return (
        <div style={styles.container}>
            <h2>Guest Management</h2>
            <div style={styles.buttonContainer}>
                <Link to={`/events/${eventId}/guests/add`} style={styles.button}>➕ Add Guest</Link>
                <Link to={`/events/${eventId}/guests/view`} style={styles.button}>👀 View Guests</Link>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "600px",
        margin: "150px auto",
        padding: "20px",
        textAlign: "center"
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px"
    },
    button: {
        backgroundColor: "#007bff",
        color: "white",
        padding: "10px 15px",
        textDecoration: "none",
        borderRadius: "5px",
        cursor: "pointer",
        width: "80%",
        textAlign: "center"
    }
};

export default GuestManagement;
