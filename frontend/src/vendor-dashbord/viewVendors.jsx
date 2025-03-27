import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Use react-router-dom for Link
import { api } from "../axios";

const ViewVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await api.get("/vendors/get");
        console.log("Fetched Vendors:", response.data.vendors); // ✅ Debug
        setVendors(response.data.vendors);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVendors();
  }, []);

  return (
    <div style={styles.container}>
      <h2>All Vendors</h2>
      {loading ? (
        <p>Loading vendors...</p>
      ) : vendors.length === 0 ? (
        <p>No vendors found.</p>
      ) : (
        <ul style={styles.list}>
          {vendors.map((vendor) => (
            <li key={vendor._id} style={styles.item}>
           <h3>{vendor.name}</h3>
            <p><strong>Service:</strong> {vendor.serviceType || "N/A"}</p> 
           <p><strong>Contact:</strong> {vendor.phone || "N/A"}</p>  
           <p><strong>Email:</strong> {vendor.email || "N/A"}</p>

              <div>
                <Link to={`/vendors/update/${vendor._id}`} style={styles.updateButton}>
                  ✏️ Update
                </Link>
                <Link to={`/vendors/delete/${vendor._id}`} style={styles.deleteButton}>
                  🗑️ Delete
                </Link>
                <Link to={`/vendors/tasks/${vendor._id}`} style={styles.assignButton}>
  📌 View Assigned Tasks
</Link>

              </div>
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
    margin: "150px auto",
    padding: "20px",
    textAlign: "center",
  },
  list: {
    listStyleType: "none",
    padding: 0,
  },
  item: {
    background: "#f8f9fa",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
  },
  updateButton: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "8px 12px",
    textDecoration: "none",
    borderRadius: "5px",
    marginRight: "10px",  // 🔹 Added margin-right for spacing
    cursor: "pointer",
    transition: "background 0.3s",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "white",
    padding: "8px 12px",
    textDecoration: "none",
    borderRadius: "5px",
    marginRight: "10px",  // 🔹 Added margin-right for spacing
    cursor: "pointer",
    transition: "background 0.3s",
  },
  assignButton: {
    backgroundColor: "#28a745",
    color: "white",
    padding: "8px 12px",
    textDecoration: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background 0.3s",
  },
};

export default ViewVendors;
