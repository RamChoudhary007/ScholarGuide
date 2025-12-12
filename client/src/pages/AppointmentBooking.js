import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function AppointmentBooking() {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: 60,
    purpose: ''
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    fetchMentorDetails();
  }, [mentorId, currentUser, navigate]);

  const fetchMentorDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/mentors/${mentorId}`);
      setMentor(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load mentor details');
      console.error('Error fetching mentor:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.date || !formData.time || !formData.purpose) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const appointmentData = {
        mentorId,
        date: formData.date,
        time: formData.time,
        duration: parseInt(formData.duration),
        purpose: formData.purpose
      };

      const response = await axios.post('/api/appointments', appointmentData);

      setSuccess(true);
      setTimeout(() => {
        navigate('/student-dashboard');
      }, 2000);

    } catch (err) {
      console.error('Error booking appointment:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to book appointment. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading mentor details...</p>
      </Container>
    );
  }

  if (!mentor) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Mentor not found</Alert.Heading>
          <p>The mentor you're trying to book with doesn't exist.</p>
        </Alert>
      </Container>
    );
  }

  const user = mentor.user || {};

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Header>
              <h2 className="mb-0">Book Appointment</h2>
            </Card.Header>
            <Card.Body>
              {/* Mentor Info */}
              <div className="mb-4 p-3 bg-light rounded">
                <h5>Booking with: {user.name || 'Unknown Mentor'}</h5>
                <p className="mb-1">{user.email}</p>
                {mentor.specialization && <p className="mb-0 text-muted">Specialization: {mentor.specialization}</p>}
              </div>

              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              {success && (
                <Alert variant="success" className="mb-3">
                  <Alert.Heading>Appointment Booked Successfully!</Alert.Heading>
                  <p>Your appointment has been booked and is pending approval. You will be redirected to your dashboard shortly.</p>
                </Alert>
              )}

              {!success && (
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Date *</Form.Label>
                        <Form.Control
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Time *</Form.Label>
                        <Form.Control
                          type="time"
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Duration (minutes)</Form.Label>
                    <Form.Select
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                    >
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hours</option>
                      <option value={120}>2 hours</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Purpose *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleInputChange}
                      placeholder="Please describe what you'd like to discuss in this appointment..."
                      required
                    />
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={submitting}
                      className="flex-fill"
                    >
                      {submitting ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Booking...
                        </>
                      ) : (
                        'Book Appointment'
                      )}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => navigate(-1)}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AppointmentBooking;
