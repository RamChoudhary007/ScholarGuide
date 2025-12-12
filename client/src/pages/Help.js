import React from 'react';
import { Container, Row, Col, Card, Accordion, Button } from 'react-bootstrap';

function Help() {
  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h1 className="text-center mb-4">Help & Support</h1>
          <p className="lead text-center">
            Find answers to your questions and get the support you need.
          </p>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <h2 className="mb-4">Frequently Asked Questions</h2>
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>How do I create an account?</Accordion.Header>
              <Accordion.Body>
                To create an account, click on the "Register" button in the navigation bar. Fill in your details including name, email, password, and select whether you're a student or mentor. Once registered, you can log in and start using the platform.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>How do I find a mentor?</Accordion.Header>
              <Accordion.Body>
                As a student, you can use the "Find Mentors" feature from the navigation bar. Browse through available mentors, filter by subject or expertise, and view their profiles to find the best match for your needs.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>How do I book an appointment?</Accordion.Header>
              <Accordion.Body>
                Once you've found a suitable mentor, visit their profile and click on "Book Appointment". Select your preferred date and time from their available slots, and confirm the booking. You'll receive a confirmation email with the details.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>What should I prepare for a mentoring session?</Accordion.Header>
              <Accordion.Body>
                Before your session, think about your goals, questions, or challenges you'd like to discuss. Prepare any relevant documents or materials. Be open-minded and ready to learn from your mentor's experience.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="4">
              <Accordion.Header>How do I leave feedback for my mentor?</Accordion.Header>
              <Accordion.Body>
                After your session, you'll have the opportunity to rate your experience and leave a review. This helps other students and allows mentors to improve their services.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="5">
              <Accordion.Header>Is my personal information secure?</Accordion.Header>
              <Accordion.Body>
                Yes, we take privacy and security seriously. All personal information is encrypted and stored securely. We never share your data with third parties without your consent.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <h2 className="text-center mb-4">Getting Started Guide</h2>
        </Col>
      </Row>

      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>For Students</Card.Title>
              <Card.Text>
                Learn how to create your profile, search for mentors, book appointments, and make the most of your mentoring experience.
              </Card.Text>
              <Button variant="primary">View Student Guide</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>For Mentors</Card.Title>
              <Card.Text>
                Discover how to set up your mentor profile, manage your availability, conduct sessions, and build your reputation.
              </Card.Text>
              <Button variant="primary">View Mentor Guide</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <h2 className="text-center mb-4">Video Tutorials</h2>
          <p className="text-center">
            Watch our step-by-step video tutorials to get a visual guide on using the platform.
          </p>
          <div className="text-center">
            <Button variant="primary" size="lg">Watch Tutorials</Button>
          </div>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <h2 className="text-center mb-4">Contact Support</h2>
          <p className="text-center">
            Still need help? Our support team is here for you.
          </p>
          <div className="text-center">
            <Button variant="success" size="lg" className="me-3">Email Support</Button>
            <Button variant="info" size="lg">Live Chat</Button>
          </div>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <h2 className="text-center mb-4">Community Forum</h2>
          <p className="text-center">
            Join our community forum to connect with other users, share experiences, and get advice from fellow students and mentors.
          </p>
          <div className="text-center">
            <Button variant="secondary" size="lg">Visit Forum</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Help;
