import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../axios";
import toast from "react-hot-toast";
import { Container, Spinner } from "react-bootstrap"; // ✅ Bootstrap components

const DeleteEvent = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (eventId) {
            const handleDelete = async () => {
                try {
                    console.log("Deleting Event ID:", eventId);
                    await api.delete(`/events/delete/${eventId}`);  te
                    
                    toast.success("Event deleted successfully!");
                    
                   
                    setTimeout(() => {
                        navigate("/events"); 
                    }, 1000);
                    
                } catch (error) {
                    console.error("Error deleting event:", error);
                    toast.error(error.response?.data?.message || "Failed to delete event. Please try again.");
                } finally {
                    setLoading(false);
                }
            };

            handleDelete();
        }
    }, [eventId, navigate]);

    return (
        <Container className="text-center mt-5">
            <h2 className="text-danger">Deleting Event...</h2>
            {loading && <Spinner animation="border" variant="danger" />}
        </Container>
    );
};

export default DeleteEvent;
