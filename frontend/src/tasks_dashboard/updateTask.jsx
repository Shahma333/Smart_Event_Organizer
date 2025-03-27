import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { api } from "../axios";
import toast from "react-hot-toast";
import { Container, Form, Button, Alert, Spinner, Card } from "react-bootstrap";

const UpdateTask = () => {
    const navigate = useNavigate();
    const { taskId } = useParams();
    const user = useSelector((state) => state.auth?.user);
    const [taskData, setTaskData] = useState({});  
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    
    if (!user?.role || !["user", "coordinator"].includes(user.role)) {
        return <Alert variant="danger" className="text-center mt-5">❌ Access Denied</Alert>;
    }

    useEffect(() => {
        if (!taskId) return;
    
        console.log("Fetching task with ID:", taskId);  
    
        const fetchTask = async () => {
            try {
                const response = await api.put(`/tasks/${taskId}`);
                console.log("API Response:", response.data);  
    
                if (!response.data || !response.data._id) {
                    throw new Error("Task data missing");
                }
    
                setTaskData(response.data);
            } catch (error) {
                console.error("Error fetching task details:", error);
                setError("Failed to load task details.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchTask();
    }, [taskId]);
    
    const handleChange = (e) => {
        setTaskData({ ...taskData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/tasks/update/${taskId}`, taskData);
            toast.success("🎉 Task updated successfully!");
           
        } catch (error) {
            toast.error("⚠️ Error updating task. Please try again.");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center mt-5">
            <Card className="p-4 shadow-lg" style={{ width: "400px" }}>
                <h2 className="text-center text-primary">📝 Update Task</h2>

                {loading ? (
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" />
                        <p>Loading task details...</p>
                    </div>
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : taskData ? (  
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Task Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="name" 
                                value={taskData.name || ""}  
                                onChange={handleChange} 
                                required 
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control 
                                as="textarea"
                                name="description" 
                                value={taskData.description || ""}  
                                onChange={handleChange} 
                                required 
                            />
                        </Form.Group>


                        <Button variant="success" type="submit" className="w-100">✅ Update Task</Button>
                    </Form>
                ) : (
                    <Alert variant="warning">⚠️ No task data found.</Alert>
                )}
            </Card>
        </Container>
    );
};

export default UpdateTask;
