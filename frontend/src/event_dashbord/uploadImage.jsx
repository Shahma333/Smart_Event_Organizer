import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../axios";
import "bootstrap/dist/css/bootstrap.min.css";

const UploadEventImage = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchEventDetails();
    }, []);

    const fetchEventDetails = async () => {
        try {
            const response = await api.get(`/events/get/${eventId}`);
            setEvent(response.data);
        } catch (error) {
            console.error("Error fetching event details:", error);
        }
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!image) return alert("Please select an image!");
        if (!description.trim()) return alert("Please enter a description!");

        const formData = new FormData();
        formData.append("image", image);
        formData.append("description", description);

        try {
            const response = await api.post(`/events/upload/${eventId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setMessage(response.data.message);
            fetchEventDetails();
            setImage(null);
            setDescription("");
        } catch (error) {
            console.error("Error uploading image:", error);
            setMessage("Error uploading image. Try again.");
        }
    };

   
    const handleDeleteImage = async (imageId) => {
        try {
            await api.delete(`/events/delete-image/${eventId}/${imageId}`);
            setMessage("Image deleted successfully!");
            fetchEventDetails(); 
        } catch (error) {
            console.error("Error deleting image:", error);
            setMessage("Failed to delete image. Try again.");
        }
    };

    if (!event) return <h3 className="text-center mt-5">Loading event details...</h3>;

    const eventDate = new Date(event.date);
    const currentDate = new Date();
    const isCompleted = eventDate < currentDate;

    return (
        <div className="container mt-5">
            <h2 className="text-center text-primary">Upload Event Images</h2>

            {isCompleted ? (
                <div className="card p-4 shadow mt-3">
                    <form onSubmit={handleUpload}>
                        <div className="mb-3">
                            <label className="form-label">Select Image</label>
                            <input type="file" className="form-control" onChange={handleFileChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Image Description</label>
                            <input
                                type="text"
                                className="form-control"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-success w-100">Upload Image</button>
                    </form>

                    {message && <p className="text-center mt-3 text-success">{message}</p>}

                    <h4 className="mt-4">Uploaded Images:</h4>
                    <div className="row">
                        {event.images && event.images.length > 0 ? (
                            event.images.map((img, index) => (
                                <div className="col-md-4 mt-2 text-center" key={index}>
                                    <img 
                                        src={`http://localhost:2030/uploads/${img.filename}`} 
                                        alt="Event" 
                                        className="img-fluid rounded shadow-sm"
                                    />
                                    <p className="mt-2"><strong>{img.description}</strong></p>

                              
                                    <button 
                                        className="btn btn-danger btn-sm mt-1" 
                                        onClick={() => handleDeleteImage(img._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted">No images uploaded yet.</p>
                        )}
                    </div>
                </div>
            ) : (
                <h3 className="text-danger text-center mt-3">You can only upload images after the event is completed.</h3>
            )}
        </div>
    );
};

export default UploadEventImage;
