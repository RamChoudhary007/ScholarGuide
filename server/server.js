/**
 * Student Monitoring System - Backend Server
 *
 * This server provides REST API endpoints for a student-mentor matching platform.
 * Features include user authentication, profile management, appointment booking,
 * and review system. Uses file-based JSON storage for data persistence.
 *
 * @author Student Monitoring System Team
 * @version 1.0.0
 */

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

// Initialize Express application
const app = express();

// ==========================================
// MIDDLEWARE CONFIGURATION
// ==========================================

/**
 * Enable Cross-Origin Resource Sharing (CORS) for all routes
 * Allows the frontend application to make requests to this API
 */
app.use(cors());

/**
 * Parse incoming JSON payloads in request bodies
 * Makes req.body available as a parsed JSON object
 */
app.use(express.json());

// ==========================================
// DATABASE CONFIGURATION
// ==========================================

/**
 * In-memory database structure
 * Data is persisted to JSON file for development purposes
 * In production, this should be replaced with a proper database (MongoDB, PostgreSQL, etc.)
 */
let database = {
  users: [],        // User accounts with authentication data
  students: [],     // Student profiles with skills and education
  mentors: [],      // Mentor profiles with expertise and availability
  appointments: [], // Scheduled mentoring sessions
  reviews: [],      // Student reviews and ratings for mentors
};

/**
 * Database file path for persistence
 * Located in the same directory as the server file
 */
const dbFile = path.join(__dirname, "database.json");

/**
 * Load database from JSON file on server startup
 * If file doesn't exist, starts with empty database
 */
try {
  if (fs.existsSync(dbFile)) {
    const data = fs.readFileSync(dbFile, "utf8");
    database = JSON.parse(data);
    console.log("Database loaded from file");
  }
} catch (error) {
  console.log("No existing database file, starting fresh");
}

/**
 * Save current database state to JSON file
 * Called after every data modification to ensure persistence
 */
function saveDatabase() {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(database, null, 2));
  } catch (error) {
    console.error("Error saving database:", error);
  }
}

/**
 * Generate unique ID for database records
 * Uses timestamp and random string for uniqueness
 * @returns {string} Unique identifier
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Add sample data if database is empty
if (database.users.length === 0) {
  console.log("Adding sample data...");

  // Sample users
  const sampleUsers = [
    {
      id: generateId(),
      name: "John Doe",
      email: "john@example.com",
      password: bcrypt.hashSync("password123", 12), // Use actual hashing
      role: "student",
      phone: "123-456-7890",
      bio: "Computer Science student looking for guidance",
      photo: "default-avatar.png",
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: "Jane Smith",
      email: "jane@example.com",
      password: bcrypt.hashSync("password123", 12), // Use actual hashing
      role: "mentor",
      phone: "098-765-4321",
      bio: "Experienced software engineer with 10+ years of experience",
      photo: "default-avatar.png",
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: "Alice Johnson",
      email: "alice@example.com",
      password: bcrypt.hashSync("password123", 12), // Use actual hashing
      role: "student",
      phone: "555-123-4567",
      bio: "Mathematics major interested in data science",
      photo: "default-avatar.png",
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: "Robert Brown",
      email: "robert@example.com",
      password: bcrypt.hashSync("password123", 12), // Use actual hashing
      role: "mentor",
      phone: "555-987-6543",
      bio: "Data scientist with expertise in machine learning",
      photo: "default-avatar.png",
      createdAt: new Date().toISOString(),
    },
  ];

  database.users = sampleUsers;

  // Sample students
  database.students = [
    {
      id: generateId(),
      userId: sampleUsers[0].id,
      skills: ["JavaScript", "React", "Node.js"],
      education: [
        {
          institution: "Tech University",
          degree: "Bachelor of Science",
          fieldOfStudy: "Computer Science",
          year: 2023,
        },
      ],
      appointments: [],
    },
    {
      id: generateId(),
      userId: sampleUsers[2].id,
      skills: ["Python", "Statistics", "Data Analysis"],
      education: [
        {
          institution: "State College",
          degree: "Bachelor of Arts",
          fieldOfStudy: "Mathematics",
          year: 2024,
        },
      ],
      appointments: [],
    },
  ];

  // Sample mentors
  database.mentors = [
    {
      id: generateId(),
      userId: sampleUsers[1].id,
      specialization: "Web Development",
      skills: ["JavaScript", "React", "Node.js", "Express", "MongoDB"],
      education: [
        {
          institution: "Engineering College",
          degree: "Master of Science",
          fieldOfStudy: "Software Engineering",
          year: 2015,
        },
      ],
      workExperience: [
        {
          position: "Senior Developer",
          company: "Tech Corp",
          startDate: "2018-01-01",
          endDate: null,
          current: true,
          description: "Leading a team of developers building web applications",
        },
      ],
      currentlyWorkingAt: "Tech Corp",
      availability: [
        {
          day: "Monday",
          slots: ["10:00", "14:00", "16:00"],
        },
        {
          day: "Wednesday",
          slots: ["09:00", "11:00", "15:00"],
        },
      ],
      appointments: [],
      rating: 4.5,
      reviews: [],
    },
    {
      id: generateId(),
      userId: sampleUsers[3].id,
      specialization: "Data Science",
      skills: [
        "Python",
        "Machine Learning",
        "TensorFlow",
        "SQL",
        "Data Visualization",
      ],
      education: [
        {
          institution: "Data University",
          degree: "PhD",
          fieldOfStudy: "Computer Science",
          year: 2018,
        },
      ],
      workExperience: [
        {
          position: "Data Scientist",
          company: "Data Insights Inc",
          startDate: "2019-03-15",
          endDate: null,
          current: true,
          description:
            "Developing machine learning models for business insights",
        },
      ],
      currentlyWorkingAt: "Data Insights Inc",
      availability: [
        {
          day: "Tuesday",
          slots: ["13:00", "15:00", "17:00"],
        },
        {
          day: "Thursday",
          slots: ["10:00", "14:00", "16:00"],
        },
      ],
      appointments: [],
      rating: 4.8,
      reviews: [],
    },
  ];

  // Sample appointments
  database.appointments = [
    {
      id: generateId(),
      studentId: database.students[0].id,
      mentorId: database.mentors[0].id,
      date: "2023-06-15",
      time: "14:00",
      duration: 60,
      purpose: "Career guidance in web development",
      status: "approved",
      notes: "Great discussion about React best practices",
      createdAt: new Date().toISOString(),
    },
  ];

  // Add appointment references to student and mentor
  database.students[0].appointments.push(database.appointments[0].id);
  database.mentors[0].appointments.push(database.appointments[0].id);

  // Sample reviews
  database.reviews = [
    {
      id: generateId(),
      studentId: database.students[0].id,
      mentorId: database.mentors[0].id,
      rating: 5,
      comment:
        "Jane was extremely helpful and provided great insights into the industry.",
      createdAt: new Date().toISOString(),
    },
  ];

  // Add review to mentor
  database.mentors[0].reviews.push(database.reviews[0].id);

  saveDatabase();
}

// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================

/**
 * JWT Authentication Middleware
 * Verifies JWT tokens in Authorization header and attaches userId to request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function auth(req, res, next) {
  try {
    // Extract token from Authorization header (format: "Bearer <token>")
    const token = req.header("Authorization")?.replace("Bearer ", "");

    // Check if token exists
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // Verify and decode JWT token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret"
    );

    // Attach user ID to request object for use in route handlers
    req.userId = decoded.userId;

    // Continue to next middleware/route handler
    next();
  } catch (error) {
    // Token verification failed
    res.status(401).json({ message: "Token is not valid" });
  }
}

/**
 * POST /api/auth/register
 * User registration endpoint
 * Creates new user account and associated profile based on role
 */
app.post("/api/auth/register", async (req, res) => {
  try {
    // Extract registration data from request body
    const { name, email, password, role, phone, bio } = req.body;

    // Check if user with this email already exists
    const userExists = database.users.find((user) => user.email === email);
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password for secure storage
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user object
    const user = {
      id: generateId(),
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      bio,
      photo: "default-avatar.png",
      createdAt: new Date().toISOString(),
    };

    // Add user to database
    database.users.push(user);

    // Create role-specific profile
    if (role === "student") {
      const student = {
        id: generateId(),
        userId: user.id,
        skills: [],
        education: [],
        appointments: [],
      };
      database.students.push(student);
    } else if (role === "mentor") {
      const mentor = {
        id: generateId(),
        userId: user.id,
        specialization: "",
        skills: [],
        education: [],
        workExperience: [],
        currentlyWorkingAt: "",
        availability: [],
        appointments: [],
        rating: 0,
        reviews: [],
      };
      database.mentors.push(mentor);
    }

    // Persist changes to file
    saveDatabase();

    // Generate JWT token for immediate authentication
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    // Return authentication token and user info (excluding password)
    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * POST /api/auth/login
 * User login endpoint
 * Authenticates user credentials and returns JWT token
 */
app.post("/api/auth/login", async (req, res) => {
  try {
    // Extract login credentials
    const { email, password } = req.body;

    console.log("Login attempt for email:", email);

    // Find user by email
    const user = database.users.find((user) => user.email === email);
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verify password against stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result for email", email, ":", isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token for session
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    // Return authentication token and user info
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * GET /api/auth/me
 * Get current authenticated user profile
 * Returns user information for the currently logged-in user
 */
app.get("/api/auth/me", auth, (req, res) => {
  try {
    // Find authenticated user by ID attached by auth middleware
    const user = database.users.find((user) => user.id === req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove password from response for security
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * PUT /api/auth/me
 * Update current authenticated user profile
 * Allows users to modify their basic profile information (name, email, phone, bio)
 */
app.put("/api/auth/me", auth, async (req, res) => {
  try {
    // Find the authenticated user by ID attached by auth middleware
    const userIndex = database.users.findIndex((user) => user.id === req.userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract update fields from request body
    const { name, email, phone, bio } = req.body;

    // Check email uniqueness if email is being updated
    if (email !== undefined && email !== database.users[userIndex].email) {
      const emailExists = database.users.find((user) => user.email === email);
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Update user fields conditionally (only if provided)
    if (name !== undefined) database.users[userIndex].name = name;
    if (email !== undefined) database.users[userIndex].email = email;
    if (phone !== undefined) database.users[userIndex].phone = phone;
    if (bio !== undefined) database.users[userIndex].bio = bio;

    // Persist changes to file
    saveDatabase();

    // Remove password from response for security
    const { password, ...userWithoutPassword } = database.users[userIndex];
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// User Routes
app.get("/api/users", (req, res) => {
  res.json(
    database.users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    })
  );
});

// Student Routes
app.get("/api/students", (req, res) => {
  const studentsWithUserData = database.students.map((student) => {
    const user = database.users.find((u) => u.id === student.userId);
    return { ...student, user };
  });
  res.json(studentsWithUserData);
});

app.get("/api/students/:id", (req, res) => {
  const student = database.students.find((s) => s.id === req.params.id);
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const user = database.users.find((u) => u.id === student.userId);
  res.json({ ...student, user });
});

// Update student profile
app.put("/api/students/me", auth, (req, res) => {
  try {
    const student = database.students.find((s) => s.userId === req.userId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const { skills, education } = req.body;

    // Update student fields
    if (skills !== undefined) student.skills = skills;
    if (education !== undefined) student.education = education;

    saveDatabase();
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Mentor Routes
app.get("/api/mentors", (req, res) => {
  const mentorsWithUserData = database.mentors.map((mentor) => {
    const user = database.users.find((u) => u.id === mentor.userId);
    return { ...mentor, user };
  });
  res.json(mentorsWithUserData);
});

app.get("/api/mentors/:id", (req, res) => {
  const mentor = database.mentors.find((m) => m.id === req.params.id);
  if (!mentor) {
    return res.status(404).json({ message: "Mentor not found" });
  }

  const user = database.users.find((u) => u.id === mentor.userId);
  res.json({ ...mentor, user });
});

// Get mentor profile
app.get("/api/mentors/me", auth, (req, res) => {
  try {
    const mentor = database.mentors.find((m) => m.userId === req.userId);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    const user = database.users.find((u) => u.id === mentor.userId);
    res.json({ ...mentor, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update mentor profile
app.put("/api/mentors/me", auth, (req, res) => {
  try {
    const mentor = database.mentors.find((m) => m.userId === req.userId);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    const { specialization, skills, education, workExperience, currentlyWorkingAt, availability } = req.body;

    // Update mentor fields
    if (specialization !== undefined) mentor.specialization = specialization;
    if (skills !== undefined) mentor.skills = skills;
    if (education !== undefined) mentor.education = education;
    if (workExperience !== undefined) mentor.workExperience = workExperience;
    if (currentlyWorkingAt !== undefined) mentor.currentlyWorkingAt = currentlyWorkingAt;
    if (availability !== undefined) mentor.availability = availability;

    saveDatabase();
    res.json(mentor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Appointment Routes
// Add to your server.js file

// Appointment Routes
app.post("/api/appointments", auth, (req, res) => {
  try {
    const { mentorId, date, time, duration, purpose } = req.body;

    // Find student
    const student = database.students.find((s) => s.userId === req.userId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find mentor
    const mentor = database.mentors.find((m) => m.id === mentorId);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    // Create appointment
    const appointment = {
      id: generateId(),
      studentId: student.id,
      mentorId: mentor.id,
      date,
      time,
      duration,
      purpose,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    database.appointments.push(appointment);

    // Add to student and mentor
    student.appointments.push(appointment.id);
    mentor.appointments.push(appointment.id);

    saveDatabase();

    res.status(201).json(appointment);
  } catch (error) {
    console.error("Appointment creation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/api/appointments", auth, (req, res) => {
  try {
    const user = database.users.find((u) => u.id === req.userId);

    let appointments = [];
    if (user.role === "student") {
      const student = database.students.find((s) => s.userId === req.userId);
      appointments = database.appointments.filter(
        (a) => a.studentId === student.id
      );
    } else if (user.role === "mentor") {
      const mentor = database.mentors.find((m) => m.userId === req.userId);
      appointments = database.appointments.filter(
        (a) => a.mentorId === mentor.id
      );
    }

    // Add student and mentor details to appointments
    const appointmentsWithDetails = appointments.map((appointment) => {
      const student = database.students.find(
        (s) => s.id === appointment.studentId
      );
      const studentUser = database.users.find((u) => u.id === student.userId);
      const mentor = database.mentors.find(
        (m) => m.id === appointment.mentorId
      );
      const mentorUser = database.users.find((u) => u.id === mentor.userId);

      return {
        ...appointment,
        student: { ...student, user: studentUser },
        mentor: { ...mentor, user: mentorUser },
      };
    });

    res.json(appointmentsWithDetails);
  } catch (error) {
    console.error("Appointments fetch error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// Review Routes
app.post("/api/reviews", auth, (req, res) => {
  try {
    const { mentorId, rating, comment } = req.body;

    // Find student
    const student = database.students.find((s) => s.userId === req.userId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find mentor
    const mentor = database.mentors.find((m) => m.id === mentorId);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    // Check if student has had an appointment with this mentor
    const hasAppointment = database.appointments.some(
      (a) =>
        a.studentId === student.id &&
        a.mentorId === mentorId &&
        a.status === "completed"
    );

    if (!hasAppointment) {
      return res
        .status(400)
        .json({
          message: "You can only review mentors you have had appointments with",
        });
    }

    // Create review
    const review = {
      id: generateId(),
      studentId: student.id,
      mentorId: mentor.id,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    database.reviews.push(review);
    mentor.reviews.push(review.id);

    // Update mentor rating
    const mentorReviews = database.reviews.filter(
      (r) => r.mentorId === mentorId
    );
    const totalRating = mentorReviews.reduce((sum, r) => sum + r.rating, 0);
    mentor.rating = totalRating / mentorReviews.length;

    saveDatabase();

    res.status(201).json(review);
  } catch (error) {
    console.error("Review creation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/api/mentors/:id/reviews", (req, res) => {
  try {
    const mentorId = req.params.id;
    const reviews = database.reviews.filter((r) => r.mentorId === mentorId);

    // Add student details to reviews
    const reviewsWithStudentDetails = reviews.map((review) => {
      const student = database.students.find((s) => s.id === review.studentId);
      const studentUser = database.users.find((u) => u.id === student.userId);

      return {
        ...review,
        student: { ...student, user: studentUser },
      };
    });

    res.json(reviewsWithStudentDetails);
  } catch (error) {
    console.error("Reviews fetch error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
