import React, { useState } from "react";
import "../styles/contact.css";
import { api } from "../axios";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { data } = await api.post("/message/send", formData);
      setResponseMessage(data.success ? "Message sent successfully!" : data.message || "Failed to send message.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setResponseMessage(error.response?.data?.message || "An error occurred. Try again.");
    }
  };

  return (
    <section className="contact">
    
      <div className="info-row">
        <div className="info-box">
          <h4>Address</h4>
          <p>Malappuram, Kerala</p>
        </div>
        <div className="info-box">
          <h4>Call Us</h4>
          <p>+91-9876543210</p>
        </div>
        <div className="info-box">
          <h4>Mail Us</h4>
          <p>contact@example.com</p>
        </div>
      </div>

      {/* Map and Form Row */}
      <div className="content-row">
        {/* Map */}
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3923.5279951942453!2d76.0739170759722!3d11.051888554039456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba64cd1c331e6f1%3A0x7e15e1aa7ef3adfd!2sMalappuram%2C%20Kerala!5e0!3m2!1sen!2sin!4v1709099958323!5m2!1sen!2sin"
            allowFullScreen
            loading="lazy"
          />
        </div>

        {/* Contact Form */}
        <div className="form-container">
          <h2>CONTACT US</h2>
          {responseMessage && <p className="response-message">{responseMessage}</p>}
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
            <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required />
            <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} required />
            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
