const express = require("express");
const {
  createSession,
  getOpenSession,
  bookSession,
  getBookedSession,
} = require("../controllers/sessionController");
const { requireSignIn, isDean } = require("../middlewares/authMiddleware");
const router = express.Router();

// Create a new session
router.post("/create", requireSignIn, isDean, createSession);

// Get a list of sessions with status "open"
router.get("/open-sessions", requireSignIn, getOpenSession);

// Book a session
router.post("/book/:studentId/:sessionId", requireSignIn, bookSession);

// Get all booked sessions with student details
router.get("/booked-sessions", requireSignIn, isDean, getBookedSession);

module.exports = router;
