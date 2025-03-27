import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../axios";
import toast from "react-hot-toast";
import { Spinner } from "react-bootstrap";

const VendorTasks = () => {
    const { vendorId } = useParams();
    const [tasks, setTasks] = useState([]);
    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVendorTasks();
    }, [vendorId]);

    const fetchVendorTasks = async () => {
        try {
            const response = await api.get(`/tasks/vendor/${vendorId}`);
            setVendor(response.data.vendor);
            setTasks(response.data.tasks);
        } catch (error) {
            console.error("Error fetching vendor tasks:", error);
            toast.error("Failed to load tasks.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <Spinner animation="border" variant="primary" />
                <p>Loading tasks...</p>
            </div>
        );
    }

    return (
        <div style={styles.vendorTasksContainer}>
            <div className="card shadow p-4">
                <h2 className="text-center mb-3">Vendor Tasks</h2>
                {vendor && <h4 className="text-primary text-center">Vendor: {vendor.name}</h4>}

                <div className="mt-4">
                    {tasks.length === 0 ? (
                        <p className="text-danger text-center">No tasks found.</p>
                    ) : (
                        <ul className="list-group">
                            {tasks.map((task) => (
                                <li key={task._id} className="list-group-item" style={styles.taskItem}>
                                    <div>
                                        <h5>{task.name}</h5>
                                        <p><strong>Event:</strong> {task.eventId?.name || "No Event"}</p>

                                        <p>
                                            <strong>Status:</strong>{" "}
                                            <span style={{ ...styles.statusBadge, backgroundColor: getStatusColor(task.status) }}>
                                                {task.status}
                                            </span>
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

// Get status badge color
const getStatusColor = (status) => {
    switch (status) {
        case "completed":
            return "#28a745"; // Green
        case "assigned":
            return "#17a2b8"; // Blue
        case "pending":
            return "#ffc107"; // Yellow
        default:
            return "#6c757d"; // Gray
    }
};

// Styles
const styles = {
    vendorTasksContainer: {
        maxWidth: "700px",
        margin: "80px auto",
        padding: "20px",
    },
    loadingContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "50px",
    },
    taskItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: "5px",
        padding: "10px",
        background: "#f8f9fa",
        marginBottom: "10px",
    },
    statusBadge: {
        padding: "5px 10px",
        borderRadius: "5px",
        color: "#fff",
        fontWeight: "bold",
        textTransform: "capitalize",
    },
};

export default VendorTasks;
