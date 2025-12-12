const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Mentor = require('../models/Mentor');

// Get current mentor profile
router.get('/me', auth, async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ user: req.userId });
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor profile not found' });
    }
    res.json(mentor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update mentor profile
router.put('/me', auth, async (req, res) => {
  try {
    const mentor = await Mentor.findOne({ user: req.userId });
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor profile not found' });
    }

    // Update fields
    const { specialization, skills, education, workExperience, currentlyWorkingAt, phone, bio, availability } = req.body;
    if (specialization) mentor.specialization = specialization;
    if (skills) mentor.skills = skills;
    if (education) mentor.education = education;
    if (workExperience) mentor.workExperience = workExperience;
    if (currentlyWorkingAt) mentor.currentlyWorkingAt = currentlyWorkingAt;
    if (phone) mentor.phone = phone;
    if (bio) mentor.bio = bio;
    if (availability) mentor.availability = availability;

    await mentor.save();
    res.json({ message: 'Mentor profile updated', mentor });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
