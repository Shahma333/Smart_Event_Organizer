import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const TasksDashboard = () => {
  const navigate = useNavigate();
  const { eventId } = useParams(); 
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.role) {
      console.log("Retrieved Role:", storedUser.role);
      setUserRole(storedUser.role.toLowerCase());
    }
  }, []);
  

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Tasks Management</h2>
      <div style={styles.buttonContainer}>
     
      {userRole === "user" && (
  <button
    style={styles.createButton}
    onClick={() => navigate(`/events/${eventId}/tasks/create`)}
  >
    ➕ Create Task
  </button>
)}



      
        <button style={styles.viewButton} onClick={() => navigate(`/events/${eventId}/tasks/view`)}>
          📋 View All Tasks
        </button>
      </div>
    </div>
  );
};


const styles = {
  container: {
    maxWidth: "500px",
    margin: "100px auto",
    padding: "25px",
    textAlign: "center",
    background: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    border: "1px solid #ddd",
  },
  heading: {
    color: "#333",
    fontSize: "24px",
    marginBottom: "20px",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "20px",
  },
  createButton: {
    padding: "12px",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#28a745", // Green for create
    color: "white",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  viewButton: {
    padding: "12px",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#28a745", // Blue for view
    color: "white",
    cursor: "pointer",
    transition: "background 0.3s",
  },
};

export default TasksDashboard;
