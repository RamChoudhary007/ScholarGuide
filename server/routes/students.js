const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Student = require('../models/Student');

// Get current student profile
router.get('/me', auth, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.userId });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update student profile
router.put('/me', auth, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.userId });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // Update fields
    const { skills, education, phone, bio } = req.body;
    if (skills) student.skills = skills;
    if (education) student.education = education;
    if (phone) student.phone = phone;
    if (bio) student.bio = bio;

    await student.save();
    res.json({ message: 'Student profile updated', student });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
