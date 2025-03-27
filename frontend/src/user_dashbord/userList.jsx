import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, Col, Container, Row, Button, Badge, Dropdown } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { api } from "../axios";

const UserManagement = () => {
  const { user } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const roles = ["user", "coordinator", "admin"];

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users/all-users", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setUsers(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users.");
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await api.get("/events/getevents", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setEvents(response.data.events);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load events.");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchEvents();
  }, []);

  const handleToggleStatus = async (userId, currentStatus) => {
    if (user?.role !== "admin") return;

    const action = currentStatus === "active" ? "Deactivate" : "Activate";
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      await api.put(`/users/status/${userId}`, {}, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      fetchUsers();
      toast.success(`User ${action.toLowerCase()}d successfully.`);
    } catch (error) {
      toast.error("Failed to update user status.");
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    if (user?.role !== "admin") return;

    if (!window.confirm(`Change role to ${newRole}?`)) return;

    try {
      await api.put(`/users/role/${userId}`, { newRole }, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      fetchUsers();
      toast.success("User role updated successfully.");
    } catch (error) {
      toast.error("Failed to update role.");
    }
  };

  return (
    <Container style={{ marginTop: "100px", paddingBottom: "50px" }}>
      <Row className="justify-content-center mb-4">
        <Col md={6} lg={4}>
          <Card className="text-center shadow-sm border-0">
            <Card.Body>
              <Card.Title className="fw-bold text-secondary">Total Users</Card.Title>
              <Card.Text className="display-4 text-danger">{users.length || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          {users.map((userItem) => {
          const userEvents = events.filter((event) => event.createdBy?._id === userItem._id);


            return (
              <Card key={userItem._id} className="mb-4 shadow-sm border-0">
                <Card.Body className="d-flex flex-wrap justify-content-between align-items-center p-4">
                  
                
                  <div style={{ flex: 1 }}>
                    <h5 className="fw-bold text-primary">{userItem.name}</h5>
                    <p className="mb-1"><strong className="text-danger">Email:</strong> {userItem.email}</p>
                    <p className="mb-1"><strong className="text-success">Username:</strong> {userItem.username}</p>

                   
                    <p className="mb-1">
                      <strong className="text-purple">Role:</strong>{" "}
                      <Badge
                        pill
                        bg={userItem.role === "admin" ? "danger" : userItem.role === "coordinator" ? "warning" : "primary"}
                        className="text-white"
                      >
                        {userItem.role}
                      </Badge>
                    </p>

                    <p className="mb-3">
                      <strong className="text-orange">Status:</strong>{" "}
                      <Badge pill bg={userItem.status === "active" ? "success" : "secondary"}>
                        {userItem.status === "active" ? "✅ Active" : "❌ Inactive"}
                      </Badge>
                    </p>

                
                    <p className="mb-1"><strong className="text-warning">Events Created:</strong></p>
                    {userEvents.length > 0 ? (
                      <ul className="list-unstyled ms-3">
                        {userEvents.map((event) => (
                          <li key={event._id} className="text-success" style={{ fontSize: "14px" }}>
                            ✔ {event.name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted">No events created.</p>
                    )}
                  </div>

                
                  {user?.role === "admin" && (
                    <div className="d-flex flex-column align-items-end gap-2">
                     
                      <Dropdown>
                        <Dropdown.Toggle variant="light" className="text-dark border px-3" style={{ fontSize: "14px" }}>
                          {userItem.role}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {roles.map((role) => (
                            <Dropdown.Item key={role} onClick={() => handleRoleUpdate(userItem._id, role)}>
                              {role}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>

                     
                      <Button
                        variant={userItem.status === "active" ? "outline-danger" : "outline-success"}
                        className="px-4 fw-bold"
                        style={{ fontSize: "14px", transition: "0.3s" }}
                        onMouseOver={(e) => (e.target.style.opacity = "0.8")}
                        onMouseOut={(e) => (e.target.style.opacity = "1")}
                        onClick={() => handleToggleStatus(userItem._id, userItem.status)}
                      >
                        {userItem.status === "active" ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            );
          })}
        </Col>
      </Row>
    </Container>
  );
};

export default UserManagement;
