import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const navigate = useNavigate();


    const styles = {
        container: {
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f4f4f4",
            padding: "20px",
        },
        title: {
            fontSize: "28px",
            fontWeight: "bold",
            marginBottom: "30px",
            color: "#333",
        },
        buttonContainer: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            maxWidth: "400px",
            width: "100%",
        },
        button: {
            backgroundColor: "green",
            color: "white",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
            textAlign: "center",
            transition: "0.3s ease-in-out",
        },
        buttonHover: {
            backgroundColor: "red",
        },
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Admin Dashboard</h2>
            <div style={styles.buttonContainer}>
                <button
                    style={styles.button}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                    onClick={() => navigate("/usersList")}
                >
                    User Management
                </button>
                <button
                    style={styles.button}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                    onClick={() => navigate("/events")}
                >
                    Event Management
                </button>
                <button
                    style={styles.button}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                    onClick={() => navigate("/vendors/get")}
                >
                    Vendor Management
                </button>
                <button
                    style={styles.button}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                    onClick={() => navigate("/coordinatorsList")}
                >
                    Coordinator Management
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
