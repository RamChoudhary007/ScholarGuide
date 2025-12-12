import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function EditProfile() {
  const { currentUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form states
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    bio: ''
  });

  const [studentForm, setStudentForm] = useState({
    skills: [],
    education: []
  });

  const [mentorForm, setMentorForm] = useState({
    specialization: '',
    skills: [],
    education: [],
    workExperience: [],
    currentlyWorkingAt: '',
    availability: []
  });

  // Temporary input states
  const [newSkill, setNewSkill] = useState('');
  const [newEducation, setNewEducation] = useState({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    year: ''
  });
  const [newWorkExperience, setNewWorkExperience] = useState({
    position: '',
    company: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });
  const [newAvailability, setNewAvailability] = useState({
    day: 'Monday',
    slots: []
  });
  const [newTimeSlot, setNewTimeSlot] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/auth/me');
        const userData = response.data;

        // Set user form data
        setUserForm({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          bio: userData.bio || ''
        });

        // Set role-specific form data
        if (currentUser.role === 'student') {
          setStudentForm({
            skills: userData.skills || [],
            education: userData.education || []
          });
        } else if (currentUser.role === 'mentor') {
          setMentorForm({
            specialization: userData.specialization || '',
            skills: userData.skills || [],
            education: userData.education || [],
            workExperience: userData.workExperience || [],
            currentlyWorkingAt: userData.currentlyWorkingAt || '',
            availability: userData.availability || []
          });
        }

        setError(null);
      } catch (err) {
        setError('Failed to load profile data');
        console.error('Error fetching profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchProfileData();
    }
  }, [currentUser]);

  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMentorFormChange = (e) => {
    const { name, value } = e.target;
    setMentorForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !studentForm.skills.includes(newSkill.trim())) {
      if (currentUser.role === 'student') {
        setStudentForm(prev => ({
          ...prev,
          skills: [...prev.skills, newSkill.trim()]
        }));
      } else {
        setMentorForm(prev => ({
          ...prev,
          skills: [...prev.skills, newSkill.trim()]
        }));
      }
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    if (currentUser.role === 'student') {
      setStudentForm(prev => ({
        ...prev,
        skills: prev.skills.filter(skill => skill !== skillToRemove)
      }));
    } else {
      setMentorForm(prev => ({
        ...prev,
        skills: prev.skills.filter(skill => skill !== skillToRemove)
      }));
    }
  };

  const addEducation = () => {
    if (newEducation.institution && newEducation.degree && newEducation.fieldOfStudy && newEducation.year) {
      if (currentUser.role === 'student') {
        setStudentForm(prev => ({
          ...prev,
          education: [...prev.education, { ...newEducation }]
        }));
      } else {
        setMentorForm(prev => ({
          ...prev,
          education: [...prev.education, { ...newEducation }]
        }));
      }
      setNewEducation({
        institution: '',
        degree: '',
        fieldOfStudy: '',
        year: ''
      });
    }
  };

  const removeEducation = (index) => {
    if (currentUser.role === 'student') {
      setStudentForm(prev => ({
        ...prev,
        education: prev.education.filter((_, i) => i !== index)
      }));
    } else {
      setMentorForm(prev => ({
        ...prev,
        education: prev.education.filter((_, i) => i !== index)
      }));
    }
  };

  const addWorkExperience = () => {
    if (newWorkExperience.position && newWorkExperience.company && newWorkExperience.startDate) {
      setMentorForm(prev => ({
        ...prev,
        workExperience: [...prev.workExperience, { ...newWorkExperience }]
      }));
      setNewWorkExperience({
        position: '',
        company: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      });
    }
  };

  const removeWorkExperience = (index) => {
    setMentorForm(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index)
    }));
  };

  const addTimeSlot = () => {
    if (newTimeSlot && !newAvailability.slots.includes(newTimeSlot)) {
      setNewAvailability(prev => ({
        ...prev,
        slots: [...prev.slots, newTimeSlot]
      }));
      setNewTimeSlot('');
    }
  };

  const removeTimeSlot = (slotToRemove) => {
    setNewAvailability(prev => ({
      ...prev,
      slots: prev.slots.filter(slot => slot !== slotToRemove)
    }));
  };

  const addAvailability = () => {
    if (newAvailability.day && newAvailability.slots.length > 0) {
      const existingIndex = mentorForm.availability.findIndex(a => a.day === newAvailability.day);
      if (existingIndex >= 0) {
        // Update existing day
        setMentorForm(prev => ({
          ...prev,
          availability: prev.availability.map((a, i) =>
            i === existingIndex ? { ...newAvailability } : a
          )
        }));
      } else {
        // Add new day
        setMentorForm(prev => ({
          ...prev,
          availability: [...prev.availability, { ...newAvailability }]
        }));
      }
      setNewAvailability({
        day: 'Monday',
        slots: []
      });
    }
  };

  const removeAvailability = (dayToRemove) => {
    setMentorForm(prev => ({
      ...prev,
      availability: prev.availability.filter(a => a.day !== dayToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Update user profile
      await axios.put('/api/auth/me', userForm);

      // Update role-specific profile
      if (currentUser.role === 'student') {
        await axios.put('/api/students/me', studentForm);
      } else if (currentUser.role === 'mentor') {
        await axios.put('/api/mentors/me', mentorForm);
      }

      // Update the user context with fresh data
      await updateUser();

      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        // Navigate back to dashboard with React Router
        navigate(currentUser.role === 'student' ? '/student-dashboard' : '/mentor-dashboard');
      }, 2000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading your profile...</p>
      </Container>
    );
  }

  return (
    <Container className="edit-profile-container">
      <div className="edit-profile-header">
        <div className="d-flex justify-content-between align-items-center">
          <h1>Edit Profile</h1>
          <Button className="edit-profile-btn-outline" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </div>

      <Row>
        <Col>
          {error && (
            <Alert variant="danger" className="edit-profile-alert mb-4">
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" className="edit-profile-alert mb-4">
              {success}
            </Alert>
          )}

          <Form onSubmit={handleSubmit} className="edit-profile-form">
            {/* Basic User Information */}
            <Card className="edit-profile-card">
              <Card.Header>
                <h5 className="mb-0">Basic Information</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={userForm.name}
                        onChange={handleUserFormChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={userForm.email}
                        onChange={handleUserFormChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={userForm.phone}
                        onChange={handleUserFormChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bio</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="bio"
                        value={userForm.bio}
                        onChange={handleUserFormChange}
                        placeholder="Tell us about yourself..."
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Skills Section */}
            <Card className="edit-profile-card">
              <Card.Header>
                <h5 className="mb-0">Skills</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3 skills-section-edit">
                  {(currentUser.role === 'student' ? studentForm.skills : mentorForm.skills).map((skill, index) => (
                    <Badge key={index} className="me-2 mb-2" style={{ cursor: 'pointer' }} onClick={() => removeSkill(skill)}>
                      {skill} ×
                    </Badge>
                  ))}
                </div>
                <Row>
                  <Col md={8}>
                    <Form.Control
                      type="text"
                      placeholder="Add a skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                  </Col>
                  <Col md={4}>
                    <Button className="edit-profile-btn" onClick={addSkill}>
                      Add Skill
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Education Section */}
            <Card className="edit-profile-card">
              <Card.Header>
                <h5 className="mb-0">Education</h5>
              </Card.Header>
              <Card.Body>
                {(currentUser.role === 'student' ? studentForm.education : mentorForm.education).map((edu, index) => (
                  <div key={index} className="mb-3 p-3 border rounded education-item">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <strong>{edu.degree}</strong> in {edu.fieldOfStudy}
                        <br />
                        <small className="text-muted">{edu.institution} - {edu.year}</small>
                      </div>
                      <Button className="edit-profile-btn-remove" size="sm" onClick={() => removeEducation(index)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="border rounded p-3 add-education-section">
                  <h6>Add Education</h6>
                  <Row>
                    <Col md={6}>
                      <Form.Control
                        type="text"
                        placeholder="Institution"
                        value={newEducation.institution}
                        onChange={(e) => setNewEducation(prev => ({ ...prev, institution: e.target.value }))}
                        className="mb-2"
                      />
                      <Form.Control
                        type="text"
                        placeholder="Degree"
                        value={newEducation.degree}
                        onChange={(e) => setNewEducation(prev => ({ ...prev, degree: e.target.value }))}
                        className="mb-2"
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Control
                        type="text"
                        placeholder="Field of Study"
                        value={newEducation.fieldOfStudy}
                        onChange={(e) => setNewEducation(prev => ({ ...prev, fieldOfStudy: e.target.value }))}
                        className="mb-2"
                      />
                      <Form.Control
                        type="number"
                        placeholder="Year"
                        value={newEducation.year}
                        onChange={(e) => setNewEducation(prev => ({ ...prev, year: e.target.value }))}
                        className="mb-2"
                      />
                    </Col>
                  </Row>
                  <Button className="edit-profile-btn" onClick={addEducation}>
                    Add Education
                  </Button>
                </div>
              </Card.Body>
            </Card>

            {/* Mentor-specific sections */}
            {currentUser.role === 'mentor' && (
              <>
                {/* Specialization */}
                <Card className="edit-profile-card">
                  <Card.Header>
                    <h5 className="mb-0">Specialization</h5>
                  </Card.Header>
                  <Card.Body>
                    <Form.Control
                      type="text"
                      name="specialization"
                      value={mentorForm.specialization}
                      onChange={handleMentorFormChange}
                      placeholder="e.g., Web Development, Data Science, etc."
                    />
                  </Card.Body>
                </Card>

                {/* Current Company */}
                <Card className="edit-profile-card">
                  <Card.Header>
                    <h5 className="mb-0">Current Company</h5>
                  </Card.Header>
                  <Card.Body>
                    <Form.Control
                      type="text"
                      name="currentlyWorkingAt"
                      value={mentorForm.currentlyWorkingAt}
                      onChange={handleMentorFormChange}
                      placeholder="Where are you currently working?"
                    />
                  </Card.Body>
                </Card>

                {/* Work Experience */}
                <Card className="edit-profile-card">
                  <Card.Header>
                    <h5 className="mb-0">Work Experience</h5>
                  </Card.Header>
                  <Card.Body>
                    {mentorForm.workExperience.map((exp, index) => (
                      <div key={index} className="mb-3 p-3 border rounded work-experience-item">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <strong>{exp.position}</strong> at {exp.company}
                            <br />
                            <small className="text-muted">
                              {exp.startDate} - {exp.endDate || 'Present'}
                            </small>
                            {exp.description && (
                              <p className="mt-1 mb-0">{exp.description}</p>
                            )}
                          </div>
                          <Button className="edit-profile-btn-remove" size="sm" onClick={() => removeWorkExperience(index)}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="border rounded p-3 add-work-experience-section">
                      <h6>Add Work Experience</h6>
                      <Row>
                        <Col md={6}>
                          <Form.Control
                            type="text"
                            placeholder="Position"
                            value={newWorkExperience.position}
                            onChange={(e) => setNewWorkExperience(prev => ({ ...prev, position: e.target.value }))}
                            className="mb-2"
                          />
                          <Form.Control
                            type="text"
                            placeholder="Company"
                            value={newWorkExperience.company}
                            onChange={(e) => setNewWorkExperience(prev => ({ ...prev, company: e.target.value }))}
                            className="mb-2"
                          />
                        </Col>
                        <Col md={6}>
                          <Form.Control
                            type="date"
                            placeholder="Start Date"
                            value={newWorkExperience.startDate}
                            onChange={(e) => setNewWorkExperience(prev => ({ ...prev, startDate: e.target.value }))}
                            className="mb-2"
                          />
                          <Form.Control
                            type="date"
                            placeholder="End Date"
                            value={newWorkExperience.endDate}
                            onChange={(e) => setNewWorkExperience(prev => ({ ...prev, endDate: e.target.value }))}
                            className="mb-2"
                            disabled={newWorkExperience.current}
                          />
                          <Form.Check
                            type="checkbox"
                            label="Current position"
                            checked={newWorkExperience.current}
                            onChange={(e) => setNewWorkExperience(prev => ({ ...prev, current: e.target.checked, endDate: e.target.checked ? '' : prev.endDate }))}
                          />
                        </Col>
                      </Row>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="Description"
                        value={newWorkExperience.description}
                        onChange={(e) => setNewWorkExperience(prev => ({ ...prev, description: e.target.value }))}
                        className="mb-2"
                      />
                      <Button className="edit-profile-btn" onClick={addWorkExperience}>
                        Add Experience
                      </Button>
                    </div>
                  </Card.Body>
                </Card>

                {/* Availability */}
                <Card className="edit-profile-card">
                  <Card.Header>
                    <h5 className="mb-0">Availability</h5>
                  </Card.Header>
                  <Card.Body>
                    {mentorForm.availability.map((avail, index) => (
                      <div key={index} className="mb-3 p-3 border rounded availability-item">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <strong>{avail.day}:</strong>
                            <div className="mt-1">
                              {avail.slots.map((slot, slotIndex) => (
                                <Badge key={slotIndex} bg="light" text="dark" className="me-1">
                                  {slot}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button className="edit-profile-btn-remove" size="sm" onClick={() => removeAvailability(avail.day)}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="border rounded p-3 add-availability-section">
                      <h6>Add Availability</h6>
                      <Row>
                        <Col md={4}>
                          <Form.Select
                            value={newAvailability.day}
                            onChange={(e) => setNewAvailability(prev => ({ ...prev, day: e.target.value }))}
                            className="mb-2"
                          >
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                            <option value="Sunday">Sunday</option>
                          </Form.Select>
                        </Col>
                        <Col md={4}>
                          <Form.Control
                            type="time"
                            value={newTimeSlot}
                            onChange={(e) => setNewTimeSlot(e.target.value)}
                            className="mb-2"
                          />
                        </Col>
                        <Col md={4}>
                          <Button className="edit-profile-btn w-100 mb-2" onClick={addTimeSlot}>
                            Add Time
                          </Button>
                        </Col>
                      </Row>
                      <div className="mb-2">
                        {newAvailability.slots.map((slot, index) => (
                          <Badge key={index} bg="secondary" className="me-1 mb-1" style={{ cursor: 'pointer' }} onClick={() => removeTimeSlot(slot)}>
                            {slot} ×
                          </Badge>
                        ))}
                      </div>
                      <Button className="edit-profile-btn" onClick={addAvailability}>
                        Add Availability
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </>
            )}

            {/* Submit Button */}
            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={() => navigate(-1)}
                className="me-2"
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" className="me-2" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default EditProfile;
