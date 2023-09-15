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

// Book a session by student
router.post("/book/session", requireSignIn, bookSession);

// Get all booked sessions with student details
router.get(
  "/booked-sessions/:deanUniversityId",
  requireSignIn,
  isDean,
  getBookedSession
);

module.exports = router;
