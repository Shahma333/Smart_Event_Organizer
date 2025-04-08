import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../axios";

const AddVendor = () => {
  const navigate = useNavigate();
  const [vendorData, setVendorData] = useState({
    name: "",
    serviceType: "", // Changed field name to match backend expectation
     phone: "" , // contact is now an object with phone
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendorData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { name, serviceType, phone, email } = vendorData;
  
    // Trim values
    const trimmedName = name.trim();
    const trimmedService = serviceType.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();
  
    // Validation checks
    if (!trimmedName || trimmedName.length < 3) {
      alert("Vendor name must be at least 3 characters.");
      return;
    }
  
    if (!trimmedService || trimmedService.length < 3) {
      alert("Service type must be at least 3 characters.");
      return;
    }
  
    if (!/^\d{10}$/.test(trimmedPhone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      alert("Please enter a valid email address.");
      return;
    }
    
  
    const vendorPayload = {
      name: trimmedName,
      serviceType: trimmedService,
      phone: trimmedPhone,
      email: trimmedEmail,
      createdBy: localStorage.getItem("user_id") || null,
    };
  
    const token = localStorage.getItem("access_token");
  
    if (!token) {
      alert("Session expired. Please log in again.");
      navigate("/login");
      return;
    }
  
    try {
      await api.post("/vendors/add", vendorPayload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      alert("Vendor added successfully!");
      navigate("/vendors/get");
    } catch (error) {
      console.error("Error adding vendor:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to add vendor");
    }
  };
  
  
  return (
    <div style={styles.container}>
      <h2>Add Vendor</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Vendor Name"
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="serviceType"
          placeholder="Service Type"
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="phone"
          placeholder="Contact Number"
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Add Vendor</button>
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
    background: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    transition: "background 0.3s",
  },
};

export default AddVendor;
