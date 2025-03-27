import React, { useEffect, useState } from "react";
import { api } from "../axios";
import { Card, Container } from "react-bootstrap";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/messages/get", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages(response.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "90px auto", padding: "20px", textAlign: "center" }}>
      <h2 className="text-center mt-4"> Messages</h2>
      {messages.length === 0 ? (
        <p className="text-danger text-center">No messages found.</p>
      ) : (
        messages.map((msg) => (
          <Card key={msg._id} className="shadow my-3">
            <Card.Body>
              <Card.Title>{msg.subject}</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {msg.name} <br />
                <strong>Email:</strong> {msg.email} <br />
                <strong>Message:</strong> {msg.message}
              </Card.Text>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default AdminMessages;
