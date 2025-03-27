import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const ViewTasks = () => {
    const { eventId } = useParams();
    const [tasks, setTasks] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState({});
    const [loading, setLoading] = useState(true);
    const userRole = JSON.parse(localStorage.getItem("user"))?.role || "";
    const [editVendorTask, setEditVendorTask] = useState(null);
   
    const [eventDate, setEventDate] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
        if (userRole === "coordinator") {
            fetchVendors();
        }
        if (eventId) {
            fetchEventDetails();
        } 
    }, [eventId, userRole]);

    const handleUpdateTask = (taskId) => {
        navigate(`/tasks/update/${taskId}`);
    };

   
    const fetchTasks = async () => {
        try {
            const response = await api.get(`/tasks/${eventId}`);
            const updatedTasks = response.data.tasks.map((task) => {
                const eventDate = new Date(task.eventDate); 
                const today = new Date();

                let updatedStatus = task.status;

                if (updatedStatus === "assigned") {
                    if (eventDate.toDateString() === today.toDateString()) {
                        updatedStatus = "in-progress";
                    } else if (eventDate < today) {
                        updatedStatus = "completed";
                    }
                }

                return { ...task, status: updatedStatus };
            });

            setTasks(updatedTasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEventDetails = async () => {
        try {
            const response = await api.get(`/events/get/${eventId}`);
            if (response.data) {
                setEventDate(response.data.date); 
            } else {
                setEventDate(null); 
            }
        } catch (error) {
            console.error("Error fetching event details:", error);
            setEventDate(null); 
        }
    };
    

    
    const fetchVendors = async () => {
        try {
            const response = await api.get("/vendors/get");
            setVendors(response.data.vendors);
        } catch (error) {
            console.error("Error fetching vendors:", error);
        }
    };

    const assignVendor = async (taskId) => {
        const vendorId = selectedVendor[taskId];
        if (!vendorId) {
            toast.error("Please select a vendor first.");
            return;
        }

        try {
            const response = await api.post("/tasks/assign-vendor", {
                taskId,
                vendorId,
            });

          
            const updatedVendor = vendors.find((vendor) => vendor._id === vendorId);

            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === taskId
                        ? { ...task, vendor: updatedVendor, status: "assigned" } 
                        : task
                )
            );

            setSelectedVendor((prev) => ({ ...prev, [taskId]: "" })); 
            setEditVendorTask(null); 
            toast.success("Vendor updated successfully!");
        } catch (error) {
            console.error("Error updating vendor:", error);
            toast.error("Failed to update vendor.");
        }
    };

    // Delete Task
    const deleteTask = async (taskId) => {
        const token = localStorage.getItem("token"); 

        try {
            await api.delete(`/tasks/delete/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` }, 
            });

            setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
            toast.success("Task deleted successfully!");
        } catch (error) {
            console.error("Error deleting task:", error.response?.data?.message || error.message);
            alert(error.response?.data?.message || "Failed to delete task.");
        }
    };

    if (loading) return <h2 style={styles.heading}>Loading tasks...</h2>;

    return (
        <div style={styles.container}>
            <h2>Event Tasks</h2>
            <ul style={styles.list}>
                {tasks.length === 0 ? <p>No tasks found.</p> : tasks.map((task) => (
                    <li key={task._id} style={styles.item}>
                        <h3>{task.name}</h3>
                        <p><strong>Description:</strong> {task.description}</p> 
                        <p><strong>Date:</strong> {eventDate ? moment(eventDate).format("DD-MM-YYYY") : "No date available"}</p>

                        <p><strong>Status:</strong>
                            <span style={{
                                ...styles.status,
                                backgroundColor: task.status === "completed"
                                    ? "#28a745"
                                    : task.status === "assigned"
                                        ? "#17a2b8"
                                        : task.status === "in-progress"
                                            ? "#007bff"
                                            : "#ffc107",
                                color: "#fff",
                            }}>
                                {task.status}
                            </span>
                        </p>

                       
                        {task.vendor ? (
                            <p style={styles.vendor}><strong>Vendor:</strong> {task.vendor.name}</p>
                        ) : (
                            <p style={styles.noVendor}><strong>No vendor assigned</strong></p>
                        )}

                        <div>
                            
{userRole === "user" && (
    <div>
        {eventDate && new Date(eventDate) < new Date() ? (
           
            <p style={{ color: "red", fontWeight: "bold" }}>
                This event has passed. Task modifications are disabled.
            </p>
        ) : null}

        <button
            onClick={() => handleUpdateTask(task._id)}
            style={{
                ...styles.updateButton,
                backgroundColor: eventDate && new Date(eventDate) < new Date() ? "#ccc" : "#007bff",
                cursor: eventDate && new Date(eventDate) < new Date() ? "not-allowed" : "pointer",
            }}
            disabled={eventDate && new Date(eventDate) < new Date()} 
        >
            ✏️ Update
        </button>

        <button
            onClick={() => deleteTask(task._id)}
            style={{
                ...styles.deleteButton,
                backgroundColor: eventDate && new Date(eventDate) < new Date() ? "#ccc" : "#dc3545",
                cursor: eventDate && new Date(eventDate) < new Date() ? "not-allowed" : "pointer",
            }}
            disabled={eventDate && new Date(eventDate) < new Date()} 
        >
            ❌ Delete
        </button>
    </div>
)}

                            
                            {userRole === "coordinator" && (
    <div>
        {eventDate && new Date(eventDate) < new Date() ? (
            
            <p style={{ color: "red", fontWeight: "bold" }}>
                This event has passed. Vendor modifications are disabled.
            </p>
        ) : (
            editVendorTask === task._id ? (
                <>
                    <select
                        onChange={(e) => {
                            const value = e.target.value;
                            setSelectedVendor((prev) => ({ ...prev, [task._id]: value }));
                        }}
                        value={selectedVendor[task._id] || task.vendor?._id || ""}
                        style={{ ...styles.dropdown, backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
                        disabled={eventDate && new Date(eventDate) < new Date()}
                    >
                        <option value="">Select Vendor</option>
                        {vendors.map((vendor) => (
                            <option key={vendor._id} value={vendor._id}>
                                {vendor.name}
                            </option>
                        ))}
                    </select>

                    <button 
                        onClick={() => assignVendor(task._id)} 
                        style={{
                            ...styles.assignButton,
                            backgroundColor: eventDate && new Date(eventDate) < new Date() ? "#ccc" : "#28a745",
                            cursor: eventDate && new Date(eventDate) < new Date() ? "not-allowed" : "pointer"
                        }}
                        disabled={eventDate && new Date(eventDate) < new Date()} 
                    >
                        Save Vendor
                    </button>

                    <button 
                        onClick={() => setEditVendorTask(null)} 
                        style={styles.cancelButton}
                    >
                        Cancel
                    </button>
                </>
            ) : (
                <button
                    onClick={() => setEditVendorTask(task._id)}
                    style={{
                        ...styles.assignButton,
                        backgroundColor: eventDate && new Date(eventDate) < new Date() ? "#ccc" : "#28a745",
                        cursor: eventDate && new Date(eventDate) < new Date() ? "not-allowed" : "pointer"
                    }}
                    disabled={eventDate && new Date(eventDate) < new Date()} 
                >
                    {task.vendor ? "✏️ Edit Vendor" : "➕ Select a Vendor"}
                </button>
            )
        )}
    </div>
)}

                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const styles = {
    container: { maxWidth: "600px", margin: "150px auto", padding: "20px", textAlign: "center" },
    heading: { color: "#333", marginBottom: "20px" },
    list: { listStyleType: "none", padding: 0 },
    item: { background: "#f8f9fa", padding: "15px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ddd" },
    status: { padding: "5px 10px", borderRadius: "5px", fontWeight: "bold", marginTop: "5px", display: "inline-block" },
    vendor: { fontSize: "14px", fontStyle: "italic", color: "#007bff", marginTop: "5px" },
    noVendor: { fontSize: "14px", fontStyle: "italic", color: "#dc3545", marginTop: "5px" },
    updateButton: { backgroundColor: "#007bff", color: "white", padding: "8px 12px", textDecoration: "none", borderRadius: "5px", marginRight: "5px", cursor: "pointer" },
    deleteButton: { backgroundColor: "#dc3545", color: "white", padding: "8px 12px", border: "none", borderRadius: "5px", cursor: "pointer", marginTop: "5px", transition: "background 0.3s" },
    assignButton: { backgroundColor: "#28a745", color: "white", padding: "8px 12px", border: "none", borderRadius: "5px", cursor: "pointer", marginTop: "5px", transition: "background 0.3s" },
    dropdown: { padding: "5px", marginTop: "5px" },
    editVendorButton: { backgroundColor: "#ffc107", color: "black", padding: "8px 12px", textDecoration: "none", borderRadius: "5px", cursor: "pointer", marginLeft: "5px", transition: "background 0.3s" },
};

export default ViewTasks;
