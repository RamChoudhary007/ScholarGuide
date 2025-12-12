const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');
const Mentor = require('../models/Mentor');

// Middleware to check if user is mentor
const isMentor = async (req, res, next) => {
  try {
    const mentor = await Mentor.findOne({ user: req.userId });
    if (!mentor) {
      return res.status(403).json({ message: 'Access denied: Not a mentor' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Mentor accepts an appointment
router.put('/accept/:id', auth, isMentor, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    if (appointment.mentor.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to accept this appointment' });
    }
    appointment.status = 'accepted';
    await appointment.save();
    res.json({ message: 'Appointment accepted', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mentor rejects an appointment
router.put('/reject/:id', auth, isMentor, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    if (appointment.mentor.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to reject this appointment' });
    }
    appointment.status = 'rejected';
    await appointment.save();
    res.json({ message: 'Appointment rejected', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
