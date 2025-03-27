import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; 

const EventOptions = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    return (
        <div style={styles.container}>
            <h2 className="mb-4 fw-bold">Event Management</h2>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="d-grid gap-3">

                    
                        {(user?.role === "user") && (
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate("/events/create")}
                            >
                                Create Event
                            </button>
                        )}


                        {user?.role === "user" && (
                            <button
                                className="btn btn-success"
                                onClick={() => navigate("/events/getevents")}
                            >
                                My Events
                            </button>
                        )}

                        {(user?.role === "coordinator" || user?.role === "admin") && (
                            <button
                                className="btn btn-info"
                                onClick={() => {
                                    
                                        navigate("/events/getevents"); 
                                   
                                }}
                            >
                                View Events
                            </button>
                        )}


                        
                        <button
                            className="btn btn-warning"
                            onClick={() => navigate("/events/completed-events")}
                        >
                            View Public Events
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};
const styles = {
    container: { maxWidth: "800px", margin: "110px auto", padding: "20px", textAlign: "center" },
};
document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);
export default EventOptions;
