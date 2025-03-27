import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from "react-bootstrap";

const EventDetails = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);

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

    if (!event) {
        return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading event details...</p>;
    }


    const carouselImages = event.images?.slice(0, 3) || [];
    const otherImages = event.images?.slice(3) || [];

    return (
        <div className="container mt-5">
            <div className="card shadow-lg p-4">
                <h2 className="text-center text-primary">{event.name}</h2>
                <p className="text-center">
                    <strong>📍 Location:</strong> {event.location || "Not Available"}
                </p>
                <p className="text-center">
                    <strong>📅 Date:</strong> {event.date ? new Date(event.date).toLocaleDateString() : "No Date Available"}
                </p>
                <p className="text-center">{event.description}</p>

              
                {carouselImages.length > 0 && (
                    <Carousel className="mt-4" interval={1000} pause={false}>
                        {carouselImages.map((img, index) => (
                            <Carousel.Item key={index}>
                                <img
                                    className="d-block w-100 rounded"
                                    src={`http://localhost:2030/uploads/${img.filename}`}
                                    alt={img.description || "Event Image"}
                                    style={styles.fullWidthImage}
                                />
                                <Carousel.Caption>
                                    <p className="bg-dark text-white p-2 rounded" style={{ display: "inline-block" }}>
                                        {img.description || "No description available"}
                                    </p>
                                </Carousel.Caption>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                )}

            
                {otherImages.length > 0 && (
                    <div className="mt-4">
                        {otherImages.map((img, index) => (
                            <div key={index} className="mb-4">
                                <img
                                    src={`http://localhost:2030/uploads/${img.filename}`}
                                    alt={img.description || "Event Image"}
                                    className="img-fluid rounded shadow"
                                    style={styles.fullWidthImage}
                                />
                                <p className="text-center mt-2 text-muted" style={styles.imgDescription}>
                                    {img.description || "No description available"}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    fullWidthImage: {
        width: "100%",
        height: "400px",
        objectFit: "cover",
        borderRadius: "10px",
    },
    imgDescription: {
        fontSize: "14px",
        fontStyle: "italic",
    },
};

export default EventDetails;
