const express = require("express");
const {
  studentLoginController,
  deanLoginController,
  studentRegisterController,
  registerDeanController,
} = require("../controllers/authController");

const router = express.Router();

// Authentication for Student
router.post("/student-login", studentLoginController);

// Authentication for dean
router.post("/dean-login", deanLoginController);

// Register a new student
router.post("/student-register", studentRegisterController);

// Register a new dean
router.post("/dean-register", registerDeanController);

module.exports = router;
