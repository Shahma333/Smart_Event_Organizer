import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../axios";
import toast from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";

const CreateTask = () => {
    const { eventId } = useParams(); 
    const navigate = useNavigate();
    const [task, setTask] = useState({ name: "", description: "", status: "pending" });

    const handleChange = (e) => {
        setTask({ ...task, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post(`/tasks/create`, { ...task, eventId });
            toast.success("Task created successfully!");
            navigate(`/events/${eventId}/tasks`);
        } catch (error) {
            console.error("Error creating task:", error.response?.data || error);
            toast.error("Failed to create task.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="card p-4 shadow">
                <h2 className="text-center text-primary">Create Task</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Task Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={task.name}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Description:</label>
                        <textarea
                            name="description"
                            value={task.description}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">Create Task</button>
                </form>
            </div>
        </div>
    );
};

export default CreateTask;
