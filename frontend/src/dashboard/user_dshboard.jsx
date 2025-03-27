import React from "react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h2>User Dashboard</h2>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigate("/events")}>
         Events
        </button>
        <button style={styles.button} onClick={() => navigate("/update/profile")}>
          Update Profile
        </button>
      
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "150px auto",
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)"
  },
  buttonContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
    marginTop: "30px"
  },
  button: {
    padding: "15px 30px",
    fontSize: "18px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#28a745",
    color: "white",
    transition: "background 0.3s"
  }
};

export default UserDashboard;
