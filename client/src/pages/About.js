import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

function About() {
  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h1 className="text-center mb-4">About ScholarGuide</h1>
          <p className="lead text-center">
            Empowering students through personalized mentorship and guidance.
          </p>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Our Mission</Card.Title>
              <Card.Text>
                To bridge the gap between students and experienced mentors, providing a platform where knowledge is shared, skills are developed, and futures are shaped. We believe that every student deserves access to guidance that can accelerate their learning and career growth.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Our Vision</Card.Title>
              <Card.Text>
                A world where mentorship is accessible to all, breaking down barriers and creating opportunities for students worldwide. We envision a community where mentors and students collaborate to achieve excellence in education and professional development.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <h2 className="text-center mb-4">What We Offer</h2>
        </Col>
      </Row>

      <Row>
        <Col md={4} className="mb-4">
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title>Personalized Matching</Card.Title>
              <Card.Text>
                Our intelligent system matches students with mentors based on their interests, goals, and expertise areas, ensuring meaningful connections.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title>Flexible Scheduling</Card.Title>
              <Card.Text>
                Book appointments at your convenience with our easy-to-use scheduling system that accommodates different time zones and availability.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title>Progress Tracking</Card.Title>
              <Card.Text>
                Monitor your development with detailed feedback, reviews, and progress reports from your mentors to stay on track with your goals.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <h2 className="text-center mb-4">Our Team</h2>
          <p className="text-center">
            We are a dedicated team of educators, developers, and mentors passionate about improving education through technology and mentorship.
          </p>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col>
          <h2 className="text-center mb-4">Contact Us</h2>
          <p className="text-center">
            Have questions or feedback? We'd love to hear from you. Reach out to us at support@studentmonitoringsystem.com
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default About;
