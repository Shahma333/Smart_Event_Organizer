import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row, Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { api } from "../axios";

const CoordinatorManagement = () => {
  const roles = ["coordinator", "admin","user"];
  const [coordinators, setCoordinators] = useState([]);

  
  const fetchCoordinators = async () => {
    try {
      const response = await api.get("/users/all-coordinators");
      setCoordinators(response.data);
    } catch (error) {
      toast.error("Failed to load coordinators.");
    }
  };

 
  useEffect(() => {
    fetchCoordinators();
  }, []);

  
  const handleToggleStatus = async (coordinatorId, currentStatus) => {
    const action = currentStatus === "active" ? "Deactivate" : "Activate";
    if (!window.confirm(`Are you sure you want to ${action} this coordinator?`)) return;

    try {
      await api.put(`/users/status/${coordinatorId}`);

     
      fetchCoordinators();

      toast.success(`Coordinator ${action.toLowerCase()}d successfully.`);
    } catch (error) {
      toast.error("Failed to update coordinator status.");
    }
  };

  
  const handleRoleUpdate = async (coordinatorId, newRole) => {
    if (!window.confirm(`Change role to ${newRole}?`)) return;

    try {
      await api.put(`/users/role/${coordinatorId}`, { newRole });

      
      fetchCoordinators();

      toast.success("Coordinator role updated successfully.");
    } catch (error) {
      toast.error("Failed to update role.");
    }
  };

  return (
    <Container style={{ marginTop: "120px" }}>
      <Row className="justify-content-center">
        
        <Col md={6} lg={4}>
          <Card bg="info" text="black" className="mb-3 text-center">
            <Card.Body>
              <Card.Title as="h3">Total Coordinators</Card.Title>
              <Card.Text as="h1">{coordinators.length || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

     
      <Row className="justify-content-center mb-4">
        <Col md={6} lg={4}>
          {coordinators.map((coordinator) => (
            <Card key={coordinator._id} className="mb-3 shadow-sm">
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 style={{ fontWeight: "bold", color: "#007bff" }}>{coordinator.username}</h5>
                  <p style={{ color: "#555" }}>
                    <strong>Email:</strong> {coordinator.email}
                  </p>
                  <p>
                    <strong>Role:</strong>
                    <select
                      className="ms-2"
                      style={{
                        padding: "5px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                      }}
                      value={coordinator.role}
                      onChange={(e) => handleRoleUpdate(coordinator._id, e.target.value)}
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span style={{ color: coordinator.status === "active" ? "green" : "red", fontWeight: "bold" }}>
                      {coordinator.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </p>
                </div>
                <div>
                  <Button
                    variant={coordinator.status === "active" ? "danger" : "success"}
                    onClick={() => handleToggleStatus(coordinator._id, coordinator.status)}
                  >
                    {coordinator.status === "active" ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default CoordinatorManagement;
