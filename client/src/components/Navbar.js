import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <BootstrapNavbar bg="light" expand="lg" className="mb-4">
      <Container>
        <LinkContainer to="/">
          <BootstrapNavbar.Brand style={{ cursor: 'pointer' }}>
            <img
              src="/scholarguide-high-resolution-logo-transparent.png"
              alt="ScholarGuide Logo"
              height="40"
              className="d-inline-block align-top"
            />
          </BootstrapNavbar.Brand>
        </LinkContainer>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/mentor-search">
              <Nav.Link>Find Mentors</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/about">
              <Nav.Link>About</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/help">
              <Nav.Link>Help</Nav.Link>
            </LinkContainer>
          </Nav>
          <Nav>
            {currentUser ? (
              <>
                {currentUser.role === 'student' && (
                  <LinkContainer to="/student-dashboard">
                    <Nav.Link>Dashboard</Nav.Link>
                  </LinkContainer>
                )}
                {currentUser.role === 'mentor' && (
                  <LinkContainer to="/mentor-dashboard">
                    <Nav.Link>Dashboard</Nav.Link>
                  </LinkContainer>
                )}
                <Nav.Link>Welcome, {currentUser.name}</Nav.Link>
                <Button variant="outline-danger" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Button style={{ backgroundColor: '#FFD700', color: '#000000', border: 'none' }} className="me-2">Login</Button>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Button style={{ backgroundColor: '#FFD700', color: '#000000', border: 'none' }}>Register</Button>
                </LinkContainer>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}

export default Navbar;