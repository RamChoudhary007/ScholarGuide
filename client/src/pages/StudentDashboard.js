import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, ListGroup, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function StudentDashboard() {
  const { currentUser, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      fetchAppointments();
    }
  }, [currentUser]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/appointments');
      setAppointments(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch appointments');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'danger';
      case 'rejected':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'accepted':
        return 'Booked';
      case 'approved':
        return 'Approved';
      case 'pending':
        return 'Pending';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading your dashboard...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Error loading dashboard</Alert.Heading>
          <p>{error}</p>
          <Button onClick={fetchAppointments} variant="outline-danger">
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Welcome, {currentUser?.name || 'Student'}!</h1>
            <Button variant="outline-danger" onClick={logout}>
              Logout
            </Button>
          </div>

          <Row>
            <Col lg={8}>
              {/* Appointments Section */}
              <Card className="shadow-sm mb-4">
                <Card.Header>
                  <h4 className="mb-0">My Appointments</h4>
                </Card.Header>
                <Card.Body>
                  {appointments.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted mb-3">You don't have any appointments yet.</p>
                      <Link to="/mentor-search">
                        <Button variant="primary">Find a Mentor</Button>
                      </Link>
                    </div>
                  ) : (
                    <ListGroup variant="flush">
                      {appointments.map((appointment) => (
                        <ListGroup.Item key={appointment.id} className="d-flex justify-content-between align-items-start">
                          <div className="ms-2 me-auto">
                            <div className="fw-bold">
                              {appointment.mentor?.user?.name || 'Unknown Mentor'}
                            </div>
                            <div className="text-muted small">
                              <strong>Date:</strong> {appointment.date} at {appointment.time}
                            </div>
                            <div className="text-muted small">
                              <strong>Duration:</strong> {appointment.duration} minutes
                            </div>
                            <div className="text-muted small">
                              <strong>Purpose:</strong> {appointment.purpose}
                            </div>
                          </div>
                          <Badge bg={getStatusBadgeVariant(appointment.status)} pill>
                            {getStatusDisplay(appointment.status)}
                          </Badge>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              {/* Quick Actions */}
              <Card className="shadow-sm mb-4">
                <Card.Header>
                  <h5 className="mb-0">Quick Actions</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-grid gap-2">
                    <Link to="/mentor-search">
                      <Button variant="primary" className="w-100">
                        Find Mentors
                      </Button>
                    </Link>
                    <Link to="/edit-profile">
                      <Button variant="outline-primary" className="w-100">
                        Edit Profile
                      </Button>
                    </Link>
                    <Button
                      variant="outline-primary"
                      className="w-100"
                      onClick={fetchAppointments}
                    >
                      Refresh Appointments
                    </Button>
                  </div>
                </Card.Body>
              </Card>

              {/* Profile Summary */}
              <Card className="shadow-sm">
                <Card.Header>
                  <h5 className="mb-0">Profile Summary</h5>
                </Card.Header>
                <Card.Body>
                  <p><strong>Name:</strong> {currentUser?.name}</p>
                  <p><strong>Email:</strong> {currentUser?.email}</p>
                  <p><strong>Role:</strong> {currentUser?.role}</p>
                  <p><strong>Total Appointments:</strong> {appointments.length}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default StudentDashboard;
