import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Help from './pages/Help';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import MentorDashboard from './pages/MentorDashboard';
import MentorSearch from './pages/MentorSearch';
import MentorProfile from './pages/MentorProfile';
import AppointmentBooking from './pages/AppointmentBooking';
import EditProfile from './pages/EditProfile';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<Help />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/mentor-dashboard" element={<MentorDashboard />} />
            <Route path="/mentor-search" element={<MentorSearch />} />
            <Route path="/mentor/:id" element={<MentorProfile />} />
            <Route path="/book-appointment/:mentorId" element={<AppointmentBooking />} />
            <Route path="/edit-profile" element={<EditProfile />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;