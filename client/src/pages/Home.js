import React from 'react';
import { Container, Button, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { currentUser } = useAuth();

  return (
    <Container>
      <Card className="mt-5 p-5 bg-primary text-white">
        <Card.Body className="text-center">
          <h1 className="display-4">Welcome to ScholarGuide</h1>
          <p className="lead">
            Connect with experienced mentors to guide your educational and career journey.
          </p>
          {!currentUser ? (
            <p>
              <LinkContainer to="/register">
                <Button variant="light" size="lg">Get Started</Button>
              </LinkContainer>
            </p>
          ) : (
            <p>
              <LinkContainer to="/mentor-search">
                <Button variant="light" size="lg">Find Mentors</Button>
              </LinkContainer>
            </p>
          )}
        </Card.Body>
      </Card>

      <Container className="mt-5">
        <h2 className="text-center mb-4">How It Works</h2>
        <div className="row">
          <div className="col-md-4 mb-4">
            <Card>
              <Card.Body className="text-center">
                <h3>1. Create Profile</h3>
                <p>Sign up as a student or mentor and create your profile.</p>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-4 mb-4">
            <Card>
              <Card.Body className="text-center">
                <h3>2. Connect</h3>
                <p>Find mentors based on your field of interest and connect with them.</p>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-4 mb-4">
            <Card>
              <Card.Body className="text-center">
                <h3>3. Book Sessions</h3>
                <p>Schedule appointments with mentors to get guidance for your future.</p>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>

      <Container className="mt-5">
        <h2 className="text-center mb-4">Features</h2>
        <div className="row">
          <div className="col-md-6 mb-4">
            <Card>
              <Card.Body>
                <h4>Personalized Mentoring</h4>
                <p>Get matched with mentors who specialize in your area of interest, ensuring tailored guidance for your academic and career goals.</p>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-6 mb-4">
            <Card>
              <Card.Body>
                <h4>Easy Scheduling</h4>
                <p>Book appointments at your convenience with our user-friendly scheduling system. Manage your sessions effortlessly.</p>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-6 mb-4">
            <Card>
              <Card.Body>
                <h4>Progress Tracking</h4>
                <p>Monitor your learning progress with detailed reviews and feedback from your mentors.</p>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-6 mb-4">
            <Card>
              <Card.Body>
                <h4>Secure Platform</h4>
                <p>Your data is protected with top-notch security measures. Connect confidently in a safe environment.</p>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>



      <Container className="mt-5 bg-secondary text-white p-5">
        <h2 className="text-center mb-4">Our Impact</h2>
        <div className="row text-center">
          <div className="col-md-3 mb-4">
            <h3 className="display-4">5000+</h3>
            <p>Students Mentored</p>
          </div>
          <div className="col-md-3 mb-4">
            <h3 className="display-4">200+</h3>
            <p>Expert Mentors</p>
          </div>
          <div className="col-md-3 mb-4">
            <h3 className="display-4">15000+</h3>
            <p>Sessions Completed</p>
          </div>
          <div className="col-md-3 mb-4">
            <h3 className="display-4">95%</h3>
            <p>Satisfaction Rate</p>
          </div>
        </div>
      </Container>

      <Container className="mt-5">
        <h2 className="text-center mb-4">Success Stories</h2>
        <div className="row">
          <div className="col-md-6 mb-4">
            <Card>
              <Card.Body>
                <blockquote className="blockquote">
                  <p>"Thanks to my mentor, I landed my dream job in software engineering. The guidance I received was invaluable."</p>
                  <footer className="blockquote-footer">Sarah Johnson, Computer Science Student</footer>
                </blockquote>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-6 mb-4">
            <Card>
              <Card.Body>
                <blockquote className="blockquote">
                  <p>"As a mentor, I've helped numerous students grow. It's rewarding to see their progress and achievements."</p>
                  <footer className="blockquote-footer">Dr. Michael Chen, Senior Software Engineer</footer>
                </blockquote>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-6 mb-4">
            <Card>
              <Card.Body>
                <blockquote className="blockquote">
                  <p>"The platform made it easy to find mentors in my field. I gained confidence and skills I never thought possible."</p>
                  <footer className="blockquote-footer">Alex Rodriguez, Business Administration Student</footer>
                </blockquote>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-6 mb-4">
            <Card>
              <Card.Body>
                <blockquote className="blockquote">
                  <p>"Mentoring on this platform has been fulfilling. I've connected with passionate students and made a real difference."</p>
                  <footer className="blockquote-footer">Emma Thompson, Marketing Professional</footer>
                </blockquote>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>

      <Container className="mt-5">
        <h2 className="text-center mb-4">What Our Users Say</h2>
        <div className="row">
          <div className="col-md-4 mb-4">
            <Card className="text-center">
              <Card.Body>
                <Card.Text>"Excellent platform for connecting with mentors. Highly recommended!"</Card.Text>
                <Card.Footer>⭐⭐⭐⭐⭐</Card.Footer>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-4 mb-4">
            <Card className="text-center">
              <Card.Body>
                <Card.Text>"The scheduling system is user-friendly and the mentors are top-notch."</Card.Text>
                <Card.Footer>⭐⭐⭐⭐⭐</Card.Footer>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-4 mb-4">
            <Card className="text-center">
              <Card.Body>
                <Card.Text>"I've grown so much thanks to the guidance I've received here."</Card.Text>
                <Card.Footer>⭐⭐⭐⭐⭐</Card.Footer>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>

      <Container className="mt-5 bg-info text-white p-5 text-center">
        <h2>Ready to Start Your Journey?</h2>
        <p className="lead">Join thousands of students and mentors who are already making a difference.</p>
        {!currentUser ? (
          <LinkContainer to="/register">
            <Button variant="light" size="lg">Join Now</Button>
          </LinkContainer>
        ) : (
          <LinkContainer to="/mentor-search">
            <Button variant="light" size="lg">Find Your Mentor</Button>
          </LinkContainer>
        )}
      </Container>
    </Container>
  );
}

export default Home;