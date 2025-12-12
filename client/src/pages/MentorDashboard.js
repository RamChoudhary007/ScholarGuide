import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, ListGroup, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function MentorDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    fetchAppointments();
  }, [currentUser, navigate]);

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

  const handleAccept = async (appointmentId) => {
    try {
      await axios.put(`/api/appointments/accept/${appointmentId}`);
      fetchAppointments();
    } catch (err) {
      console.error('Error accepting appointment:', err);
      setError('Failed to accept appointment');
    }
  };

  const handleReject = async (appointmentId) => {
    try {
      await axios.put(`/api/appointments/reject/${appointmentId}`);
      fetchAppointments();
    } catch (err) {
      console.error('Error rejecting appointment:', err);
      setError('Failed to reject appointment');
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'completed':
        return 'info';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-warning">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="text-warning">☆</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-muted">☆</span>);
    }

    return stars;
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
    <Container className="mentor-dashboard-container">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="mentor-dashboard-welcome">Welcome, {currentUser?.name || 'Mentor'}!</h1>
            <div>
              <Link to="/edit-profile">
                <Button variant="outline-primary" className="me-2 custom-dashboard-btn">
                  Edit Profile
                </Button>
              </Link>
              <Button variant="outline-danger" onClick={() => { logout(); navigate('/login'); }} className="custom-dashboard-btn">
                Logout
              </Button>
            </div>
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
                      <p className="text-muted">Students will book appointments with you once they find your profile.</p>
                    </div>
                  ) : (
                    <ListGroup variant="flush">
                      {appointments.map((appointment) => (
                        <ListGroup.Item key={appointment.id} className="d-flex justify-content-between align-items-start">
                          <div className="ms-2 me-auto">
                            <div className="fw-bold">
                              {appointment.student?.user?.name || 'Unknown Student'}
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
                            {appointment.status === 'pending' && (
                              <div className="mt-2">
                                <Button
                                  variant="success"
                                  size="sm"
                                  className="me-2"
                                  onClick={() => handleAccept(appointment.id)}
                                >
                                  Accept
                                </Button>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleReject(appointment.id)}
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                          </div>
                          <Badge bg={getStatusBadgeVariant(appointment.status)} pill>
                            {appointment.status}
                          </Badge>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              {/* Profile Overview */}
              <Card className="shadow-sm mb-4">
                <Card.Header>
                  <h5 className="mb-0">Profile Overview</h5>
                </Card.Header>
                <Card.Body>
                  <div className="text-center mb-3">
                    <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', fontSize: '24px' }}>
                      {currentUser?.name?.charAt(0)?.toUpperCase() || 'M'}
                    </div>
                  </div>
                  <p><strong>Name:</strong> {currentUser?.name}</p>
                  <p><strong>Email:</strong> {currentUser?.email}</p>
                  <p><strong>Phone:</strong> {currentUser?.phone}</p>
                  <p><strong>Bio:</strong> {currentUser?.bio}</p>
                  <p><strong>Specialization:</strong> {currentUser?.specialization || 'Not specified'}</p>
                  <p><strong>Current Company:</strong> {currentUser?.currentlyWorkingAt || 'Not specified'}</p>
                  <div className="mb-2">
                    <strong>Rating:</strong>
                    <div className="d-flex align-items-center">
                      <span className="me-2">{renderStars(currentUser?.rating || 0)}</span>
                      <span className="text-muted">({currentUser?.rating?.toFixed(1) || '0.0'})</span>
                    </div>
                  </div>
                  <p><strong>Total Appointments:</strong> {appointments.length}</p>
                </Card.Body>
              </Card>

              {/* Skills */}
              <Card className="shadow-sm mb-4 skills-section">
                <Card.Header>
                  <h5 className="mb-0">Skills</h5>
                </Card.Header>
                <Card.Body>
                  {currentUser?.skills && currentUser.skills.length > 0 ? (
                    <div className="d-flex flex-wrap">
                      {currentUser.skills.map((skill, index) => (
                        <Badge key={index} className="mb-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">No skills specified</p>
                  )}
                </Card.Body>
              </Card>

              {/* Availability */}
              <Card className="shadow-sm mb-4 availability-section">
                <Card.Header>
                  <h5 className="mb-0">Availability</h5>
                </Card.Header>
                <Card.Body>
                  {currentUser?.availability && currentUser.availability.length > 0 ? (
                    <ListGroup variant="flush">
                      {currentUser.availability.map((slot, index) => (
                        <ListGroup.Item key={index} className="px-0 py-2">
                          <strong>{slot.day}:</strong>
                          <div className="mt-1">
                            {slot.slots.map((time, timeIndex) => (
                              <Badge key={timeIndex} className="availability-slot me-1 mb-1">
                                {time}
                              </Badge>
                            ))}
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <p className="text-muted">No availability specified</p>
                  )}
                </Card.Body>
              </Card>

              {/* Quick Actions */}
              <Card className="shadow-sm quick-actions-section">
                <Card.Header>
                  <h5 className="mb-0">Quick Actions</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-grid gap-2">
                    <Link to="/edit-profile">
                      <Button className="w-100">
                        Edit Profile
                      </Button>
                    </Link>
                    <Button
                      variant="outline-primary"
                      className="w-100"
                      onClick={() => {
                        fetchAppointments();
                      }}
                    >
                      Refresh Data
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Education & Experience Section */}
          <Row className="mt-4">
            <Col md={6}>
              <Card className="shadow-sm">
                <Card.Header>
                  <h5 className="mb-0">Education</h5>
                </Card.Header>
                <Card.Body>
                  {currentUser?.education && currentUser.education.length > 0 ? (
                    <ListGroup variant="flush">
                      {currentUser.education.map((edu, index) => (
                        <ListGroup.Item key={index} className="px-0">
                          <div className="fw-bold">{edu.degree}</div>
                          <div className="text-muted">{edu.fieldOfStudy}</div>
                          <div className="text-muted small">{edu.institution} - {edu.year}</div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <p className="text-muted">No education information specified</p>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="shadow-sm">
                <Card.Header>
                  <h5 className="mb-0">Work Experience</h5>
                </Card.Header>
                <Card.Body>
                  {currentUser?.workExperience && currentUser.workExperience.length > 0 ? (
                    <ListGroup variant="flush">
                      {currentUser.workExperience.map((exp, index) => (
                        <ListGroup.Item key={index} className="px-0">
                          <div className="fw-bold">{exp.position}</div>
                          <div className="text-muted">{exp.company}</div>
                          <div className="text-muted small">
                            {exp.startDate} - {exp.endDate || 'Present'}
                          </div>
                          <div className="text-muted small mt-1">{exp.description}</div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <p className="text-muted">No work experience specified</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default MentorDashboard;
