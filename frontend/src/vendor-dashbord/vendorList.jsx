import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Use React Router for navigation
import { api } from "../axios";

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

 
   useEffect(() => {
      const fetchVendors = async () => {
        try {
          const response = await api.get("/vendors/get");
          setVendors(response.data.vendors);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
      fetchVendors();
    }, []);
  
  
  const handleDelete = async (vendorId) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      try {
        await api.delete(`/vendors/${vendorId}`);
        setVendors((prevVendors) => prevVendors.filter(v => v.vendor._id !== vendorId));
      } catch (error) {
        console.error("Error deleting vendor:", error);
        alert("Failed to delete vendor");
      }
    }
  };


  const handleEdit = (vendorId) => {
    navigate(`/edit-vendor/${vendorId}`); 
  };

  if (loading) return <p className="text-center mt-3">Loading vendors...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h2 className="text-center">Vendors List</h2>
      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Service Type</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Assigned Tasks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map(({ vendor, tasks }) => (
            <tr key={vendor._id}>
              <td>{vendor.name}</td>
              <td>{vendor.serviceType}</td>
              <td>{vendor.phone}</td>
              <td>{vendor.email}</td>
              <td>
                {tasks.length > 0 ? (
                  <ul className="list-unstyled">
                    {tasks.map((task) => (
                      <li key={task._id}>&#8226; {task.taskName}</li>
                    ))}
                  </ul>
                ) : (
                  "No tasks assigned"
                )}
              </td>
              <td>
                <button className="btn btn-success btn-sm me-2" onClick={() => handleEdit(vendor._id)}>
                  Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(vendor._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Vendors;
