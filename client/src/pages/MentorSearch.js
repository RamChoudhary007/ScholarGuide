import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function MentorSearch() {
  const [mentors, setMentors] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchMentors();
  }, []);

  useEffect(() => {
    filterAndSortMentors();
  }, [mentors, searchTerm, sortBy]);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/mentors');
      if (!response.ok) {
        throw new Error('Failed to fetch mentors');
      }
      const data = await response.json();
      setMentors(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortMentors = () => {
    let filtered = mentors.filter(mentor => {
      const searchLower = searchTerm.toLowerCase();
      const user = mentor.user || {};
      const name = user.name || '';
      const specialization = mentor.specialization || '';
      const skills = mentor.skills || [];
      const skillsString = skills.join(' ').toLowerCase();

      return name.toLowerCase().includes(searchLower) ||
             specialization.toLowerCase().includes(searchLower) ||
             skillsString.includes(searchLower);
    });

    // Sort mentors
    filtered.sort((a, b) => {
      const userA = a.user || {};
      const userB = b.user || {};

      switch (sortBy) {
        case 'name':
          return (userA.name || '').localeCompare(userB.name || '');
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'experience':
          // Sort by number of work experiences
          return (b.workExperience?.length || 0) - (a.workExperience?.length || 0);
        default:
          return 0;
      }
    });

    setFilteredMentors(filtered);
  };

  const getExperienceYears = (workExperience) => {
    if (!workExperience || workExperience.length === 0) return 0;

    // Calculate total years from work experience
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

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading mentors...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Error loading mentors</Alert.Heading>
          <p>{error}</p>
          <Button onClick={fetchMentors} variant="outline-danger">
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Find Mentors</h1>

      {/* Search and Sort Controls */}
      <Row className="mb-4">
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by name, specialization, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Rating</option>
            <option value="experience">Sort by Experience</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Results Count */}
      <p className="text-muted mb-3">
        {filteredMentors.length} mentor{filteredMentors.length !== 1 ? 's' : ''} found
      </p>

      {/* Mentors Grid */}
      <Row>
        {filteredMentors.map((mentor) => {
          const user = mentor.user || {};
          const experienceYears = getExperienceYears(mentor.workExperience);

          return (
            <Col key={mentor.id} lg={4} md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <div className="text-center mb-3">
                    <div
                      className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                      style={{ width: '60px', height: '60px', fontSize: '24px' }}
                    >
                      {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <h5 className="mt-2 mb-1">{user.name || 'Unknown Mentor'}</h5>
                    <p className="text-muted small mb-2">{user.email}</p>
                  </div>

                  <div className="mb-3">
                    <strong>Specialization:</strong> {mentor.specialization || 'Not specified'}
                  </div>

                  <div className="mb-3">
                    <strong>Rating:</strong>{' '}
                    <span className="me-2">
                      {renderStars(mentor.rating)}
                    </span>
                    {mentor.rating ? mentor.rating.toFixed(1) : 'No rating'}
                  </div>

                  <div className="mb-3">
                    <strong>Experience:</strong> {experienceYears} year{experienceYears !== 1 ? 's' : ''}
                  </div>

                  <div className="mb-3">
                    <strong>Skills:</strong>
                    <div className="mt-1">
                      {mentor.skills && mentor.skills.length > 0 ? (
                        mentor.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} bg="secondary" className="me-1 mb-1">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted">No skills listed</span>
                      )}
                      {mentor.skills && mentor.skills.length > 3 && (
                        <Badge bg="light" text="dark" className="me-1 mb-1">
                          +{mentor.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto">
                    <Link to={`/mentor/${mentor.id}`}>
                      <Button variant="primary" className="w-100">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {filteredMentors.length === 0 && !loading && (
        <div className="text-center mt-5">
          <p className="text-muted">No mentors found matching your search criteria.</p>
        </div>
      )}
    </Container>
  );
}

export default MentorSearch;
