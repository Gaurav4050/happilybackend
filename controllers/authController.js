const Student = require("../models/student");
const Dean = require("../models/dean");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// register student
exports.studentRegisterController = async (req, res) => {
  try {
    const { universityId, password, name } = req.body;

    // Check if the student already exists
    const existingStudent = await Student.findOne({ universityId });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Use 10 rounds of salting

    // Create a new student with the hashed password
    const newStudent = new Student({
      universityId,
      password: hashedPassword,
      name,
    });
    await newStudent.save();

    res.status(201).json({ newStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// register Dean
exports.registerDeanController = async (req, res) => {
  try {
    const { universityId, password } = req.body;

    // Check if the dean already exists
    const existingDean = await Dean.findOne({ universityId });
    if (existingDean) {
      return res.status(400).json({ message: "Dean already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Use 10 rounds of salting

    // Create a new dean with the hashed password
    const newDean = new Dean({ universityId, password: hashedPassword });
    await newDean.save();

    res.status(201).json({ newDean });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Authenticate the student
exports.studentLoginController = async (req, res) => {
  try {
    const { universityId, password } = req.body;

    const student = await Student.findOne({ universityId });

    if (!student) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, student.password);
    if (!match) {
      return res.status(41).send({
        success: false,
        message: "Invalid Password",
      });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: student._id }, process.env.JWT_SECRET);

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Authentication for dean
exports.deanLoginController = async (req, res) => {
  try {
    // Authenticate the student
    const { universityId, password } = req.body;
    const dean = await Dean.findOne({ universityId });

    if (!dean) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, dean.password);
    if (!match) {
      return res.status(41).send({
        success: false,
        message: "Invalid Password",
      });
    }
    // Generate a JWT token
    const token = jwt.sign({ userId: dean._id }, process.env.JWT_SECRET);

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
