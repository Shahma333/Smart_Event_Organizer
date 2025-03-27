import React from "react";
import "../styles/about.css";
import aboutImage from "../assets/party.jpg"; 

const AboutUs = () => {
  return (
    <section className="about-us" id="about" style={{ padding: "50px 20px", backgroundColor: "#f8f9fa" }}>
      <div className="about-container" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "40px", maxWidth: "1200px", margin: "auto" }}>
        
      
        <div className="about-image" style={{ flex: "1" }}>
          <img 
            src={aboutImage} 
            alt="Event Planning" 
            style={{ width: "100%", maxWidth: "500px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }} 
          />
        </div>

      
        <div className="about-content" style={{ flex: "1", textAlign: "left" }}>
          <h2 style={{ color: "#007bff", fontWeight: "bold" }}>About Smart Event Organizer</h2>
          <p style={{ fontSize: "18px", color: "#333", lineHeight: "1.6" }}>
            Welcome to <span style={{ fontWeight: "bold", color: "#007bff" }}>Smart Event Organizer</span> – your all-in-one event management solution! 🎉  
            Whether you're planning a <strong>wedding, corporate event, or private party</strong>, we've got you covered.
          </p>

          <h3 style={{ marginTop: "20px", fontSize: "22px", color: "#444" }}>Why Choose Us?</h3>
          <div className="features" style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "15px" }}>
            
            <div className="feature-box" style={{ background: "#fff", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", flex: "1", minWidth: "250px" }}>
              <h4>📌 Task Management</h4>
              <p style={{ fontSize: "16px", color: "#666" }}>Plan, assign, and track event tasks effortlessly.</p>
            </div>

            <div className="feature-box" style={{ background: "#fff", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", flex: "1", minWidth: "250px" }}>
              <h4>🎤 Vendor Coordination</h4>
              <p style={{ fontSize: "16px", color: "#666" }}>Find and manage top vendors for your event.</p>
            </div>

          </div>

          <p className="closing" style={{ marginTop: "30px", fontSize: "18px", fontWeight: "bold", color: "#007bff" }}>
            Let's create <span style={{ fontStyle: "italic" }}>memorable events</span> together! 🚀
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
