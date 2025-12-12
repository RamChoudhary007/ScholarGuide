import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert, Spinner, ListGroup, Tab, Tabs } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function MentorProfile() {
  const { id } = useParams();
  const [mentor, setMentor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMentorProfile();
    fetchAppointments();
  }, [id]);

  const fetchMentorProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/mentors/${id}`);
      setMentor(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch mentor profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/api/appointments');
      // Filter appointments for this mentor
      const mentorAppointments = response.data.filter(app => app.mentor.id === id);
      setAppointments(mentorAppointments);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} style={{ color: '#ffc107' }}>★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" style={{ color: '#ffc107' }}>☆</span>);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<span key={i} style={{ color: '#e4e5e9' }}>☆</span>);
    }
    return stars;
  };

  const getExperienceYears = (workExperience) => {
    if (!workExperience || workExperience.length === 0) return 0;

    let totalYears = 0;
    workExperience.forEach(exp => {
      if (exp.startDate) {
        const startYear = new Date(exp.startDate).getFullYear();
        const endYear = exp.endDate ? new Date(exp.endDate).getFullYear() : new Date().getFullYear();
        totalYears += endYear - startYear;
      }
    });
    return totalYears;
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading mentor profile...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Error loading mentor profile</Alert.Heading>
          <p>{error}</p>
          <Button onClick={fetchMentorProfile} variant="outline-danger">
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!mentor) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">
          <Alert.Heading>Mentor not found</Alert.Heading>
          <p>The mentor you're looking for doesn't exist.</p>
        </Alert>
      </Container>
    );
  }

  const user = mentor.user || {};
  const experienceYears = getExperienceYears(mentor.workExperience);

  return (
    <Container className="mt-4">
      <Row>
        <Col lg={4}>
          {/* Profile Card */}
          <Card className="mb-4 shadow-sm">
            <Card.Body className="text-center">
              <div
                className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '100px', height: '100px', fontSize: '40px' }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : '?'}
              </div>
              <h3 className="mb-1">{user.name || 'Unknown Mentor'}</h3>
              <p className="text-muted mb-2">{user.email}</p>
              {user.phone && <p className="text-muted small mb-3">{user.phone}</p>}

              <div className="mb-3">
                <strong>Rating:</strong>
                <div className="mt-1">
                  {renderStars(mentor.rating)}
                  <span className="ms-2">
                    {mentor.rating ? mentor.rating.toFixed(1) : 'No rating'}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <strong>Experience:</strong> {experienceYears} year{experienceYears !== 1 ? 's' : ''}
              </div>

              <Link to={`/book-appointment/${mentor.id}`}>
                <Button variant="primary" className="w-100">
                  Book Appointment
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          {/* Main Content */}
          <Card className="shadow-sm">
            <Card.Body>
              <Tabs defaultActiveKey="overview" className="mb-4">
                <Tab eventKey="overview" title="Overview">
                  <div className="mb-4">
                    <h5>About</h5>
                    <p>{user.bio || 'No bio available'}</p>
                  </div>

                  {mentor.specialization && (
                    <div className="mb-4">
                      <h5>Specialization</h5>
                      <p>{mentor.specialization}</p>
                    </div>
                  )}

                  {mentor.skills && mentor.skills.length > 0 && (
                    <div className="mb-4">
                      <h5>Skills</h5>
                      <div>
                        {mentor.skills.map((skill, index) => (
                          <Badge key={index} bg="secondary" className="me-2 mb-2">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {mentor.currentlyWorkingAt && (
                    <div className="mb-4">
                      <h5>Currently Working At</h5>
                      <p>{mentor.currentlyWorkingAt}</p>
                    </div>
                  )}
                </Tab>

                <Tab eventKey="experience" title="Experience">
                  {mentor.workExperience && mentor.workExperience.length > 0 ? (
                    <ListGroup variant="flush">
                      {mentor.workExperience.map((exp, index) => (
                        <ListGroup.Item key={index}>
                          <h6>{exp.position}</h6>
                          <p className="text-muted mb-1">{exp.company}</p>
                          <p className="text-muted small">
                            {new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}
                          </p>
                          {exp.description && <p>{exp.description}</p>}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <p className="text-muted">No work experience listed</p>
                  )}
                </Tab>

                <Tab eventKey="education" title="Education">
                  {mentor.education && mentor.education.length > 0 ? (
                    <ListGroup variant="flush">
                      {mentor.education.map((edu, index) => (
                        <ListGroup.Item key={index}>
                          <h6>{edu.degree} in {edu.fieldOfStudy}</h6>
                          <p className="text-muted mb-1">{edu.institution}</p>
                          <p className="text-muted small">Graduated: {edu.year}</p>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <p className="text-muted">No education information available</p>
                  )}
                </Tab>

                <Tab eventKey="availability" title="Availability">
                  {mentor.availability && mentor.availability.length > 0 ? (
                    <ListGroup variant="flush">
                      {mentor.availability.map((avail, index) => (
                        <ListGroup.Item key={index}>
                          <h6>{avail.day}</h6>
                          <div>
                            {avail.slots && avail.slots.map((slot, slotIndex) => (
                              <Badge key={slotIndex} bg="success" className="me-2 mb-1">
                                {slot}
                              </Badge>
                            ))}
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <p className="text-muted">No availability information available</p>
                  )}
                </Tab>
              </Tabs>

              {/* Appointments Section */}
              <div className="mt-4">
                <h4>Appointments</h4>
                {appointments.length === 0 ? (
                  <p>No appointments found.</p>
                ) : (
                  <ListGroup>
                    {appointments.map((appointment) => (
                      <ListGroup.Item key={appointment.id}>
                        <strong>Date:</strong> {appointment.date} <br />
                        <strong>Time:</strong> {appointment.time} <br />
                        <strong>Duration:</strong> {appointment.duration} minutes <br />
                        <strong>Purpose:</strong> {appointment.purpose} <br />
                        <strong>Status:</strong> {appointment.status}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default MentorProfile;
