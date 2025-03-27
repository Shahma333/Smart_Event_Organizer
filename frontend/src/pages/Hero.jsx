import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/hero.css";
import bg from "../assets/bg.png";

const HeroSection = () => {
    const navigate = useNavigate(); // Initialize navigation

    return (
        <section className="hero">
            <img src={bg} alt="Event Banner" />
            <div className="item" style={{ marginTop: "30px" }}>
                <h3 style={{ color: "#007bff", fontSize: "24px", fontWeight: "bold" }}>Plan Your Event</h3>
                <div>
                    <h1 style={{ fontSize: "36px", fontWeight: "700", margin: "10px 0" }}>Make Every Event Special</h1>
                    <p style={{ fontSize: "18px", color: "#6c757d" }}>
                        Manage, organize, and enjoy stress-free events with ease!
                    </p>

                  
                    <button 
                        onClick={() => navigate("/login")}
                        style={{
                            backgroundColor: "#007bff",
                            color: "white",
                            padding: "12px 20px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "16px",
                            margin: "10px",
                            transition: "0.3s"
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
                        onMouseOut={(e) => e.target.style.backgroundColor = "#007bff"}
                    >
                        GET STARTED
                    </button>

               
                    <button 
                        onClick={() => navigate("/events/completed-events")}
                        style={{
                            backgroundColor: "#28a745",
                            color: "white",
                            padding: "12px 20px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "16px",
                            margin: "10px",
                            transition: "0.3s"
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = "#218838"}
                        onMouseOut={(e) => e.target.style.backgroundColor = "#28a745"}
                    >
                        SEE OUR EVENTS
                    </button>
                </div>
            </div>
            <div className="hero-paragraph">
                <p>
                    <b>Welcome to <strong>Smart Event Organizer</strong>, where planning your dream event becomes a breeze.
                    Whether it's a wedding, corporate event, or private gathering, we make every occasion memorable.</b>
                </p>
            </div>
        </section>
    );
};

export default HeroSection;
