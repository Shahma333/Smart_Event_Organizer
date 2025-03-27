import React from "react";
import { useNavigate } from "react-router-dom";

const VendorsDashboard = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h2>Vendors Management</h2>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigate("/vendors/add")}>Add Vendor</button>
        <button style={styles.button} onClick={() => navigate("/vendors/get")}>View All Vendors</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "100px auto",
    padding: "20px",
    textAlign: "center",
    background: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "20px",
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#28a745",
    color: "white",
    cursor: "pointer",
    transition: "background 0.3s",
  },
};

export default VendorsDashboard;
