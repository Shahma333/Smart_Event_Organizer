import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../axios";

const UpdateVendor = () => {
  const navigate = useNavigate();
  const { vendorId } = useParams();
  const [vendorData, setVendorData] = useState({
    name: "",
    service: "",
    contact: "",
    email: "",
  });

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await api.get(`/vendors/${vendorId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        });
        setVendorData(response.data.vendor);
      } catch (error) {
        console.error("Error fetching vendor details:", error);
        alert("Error fetching vendor details");
        navigate("/vendors");
      }
    };

    if (vendorId) fetchVendor();
  }, [vendorId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendorData({ ...vendorData, [name]: value });
};

  console.log("Vendor ID from URL:", vendorId);
  const token = localStorage.getItem("access_token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/vendors/${vendorId}`, vendorData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });
      alert("Vendor updated successfully!");
      navigate("/vendors/get");
    } catch (error) {
      console.error("Error updating vendor:", error);
      alert(error.response?.data?.message || "Failed to update vendor");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Update Vendor</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Vendor Name"
          value={vendorData.name}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <input
          type="text"
          name="service"
          placeholder="Service Type"
          value={vendorData.service}
          onChange={handleChange}
          style={styles.input}
          required
        />
   <input
  type="text"
  name="phone"  
  placeholder="Contact Number"
  value={vendorData.phone || ""}  
  onChange={handleChange}
  style={styles.input}
  required
/>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={vendorData.email}
          onChange={handleChange}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>
          Update Vendor
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

export default UpdateVendor;
