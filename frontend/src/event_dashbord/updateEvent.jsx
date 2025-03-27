import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { api } from "../axios";
import toast from "react-hot-toast";
import { Container, Form, Button, Alert, Spinner, Card } from "react-bootstrap";

const UpdateEvent = () => {
    const navigate = useNavigate();
    const { eventId } = useParams();
    const user = useSelector((state) => state.auth?.user);
    const [eventData, setEventData] = useState({});  
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    
    if (!user?.role || !["admin", "coordinator", "user"].includes(user.role)) {
        return <Alert variant="danger" className="text-center mt-5">❌ Access Denied</Alert>;
    }

    useEffect(() => {
        if (!eventId) return;
    
        const fetchEvent = async () => {
            try {
                console.log("Fetching event with ID:", eventId);
                const response = await api.get(`/events/get/${eventId}`);
        
                console.log("API Response:", response.data); 
        
                if (!response.data || !response.data._id) {  
                    throw new Error("Event data missing");
                }
        
                setEventData(response.data);  
            } catch (error) {
                console.error("Error fetching event details:", error);
                setError("Failed to load event details.");
            } finally {
                setLoading(false);
            }
        };
        
        fetchEvent();
    }, [eventId]);
    

    const handleChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/events/update/${eventId}`, eventData);
            toast.success("🎉 Event updated successfully!");
            navigate("/events");
        } catch (error) {
            toast.error("⚠️ Error updating event. Please try again.");
        }
    };
    const isEventCompleted = () => {
        if (!eventData?.date) return false;
        const eventDate = new Date(eventData.date);
        return eventDate < new Date();  
    };
    
    return (
        <Container className="d-flex justify-content-center align-items-center mt-5">
            <Card className="p-4 shadow-lg" style={{ width: "400px" }}>
                <h2 className="text-center text-primary">📝 Update Event</h2>

                {loading ? (
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" />
                        <p>Loading event details...</p>
                    </div>
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : eventData ? (  
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Event Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="name" 
                                value={eventData.name || ""}  
                                onChange={handleChange} 
                                required 
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
    <Form.Label>Date</Form.Label>
    <Form.Control 
        type="date" 
        name="date" 
        value={eventData.date || ""}  
        onChange={handleChange} 
        required 
        disabled={isEventCompleted()} 
    />
    {isEventCompleted() && <small className="text-danger">⚠️ Completed events cannot be rescheduled.</small>}
</Form.Group>


                        <Form.Group className="mb-3">
                            <Form.Label>Location</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="location" 
                                value={eventData.location || ""}  
                                onChange={handleChange} 
                                required 
                            />
                        </Form.Group>

                        <Button variant="success" type="submit" className="w-100">✅ Update Event</Button>
                    </Form>
                ) : (
                    <Alert variant="warning">⚠️ No event data found.</Alert>
                )}
            </Card>
        </Container>
    );
};

export default UpdateEvent;
