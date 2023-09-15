const Auth = require("../models/auth");
const Session = require("../models/session");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// register student
exports.studentRegisterController = async (req, res) => {
  try {
    const { universityId, password, name, userType } = req.body;

    // Check if the student already exists
    const existingStudent = await Auth.findOne({ universityId });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Use 10 rounds of salting

    // Create a new student with the hashed password
    const newStudent = new Auth({
      universityId,
      password: hashedPassword,
      name,
      userType,
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
    const { universityId, password, name, userType } = req.body;

    // Check if the dean already exists
    const existingDean = await Auth.findOne({ universityId });
    if (existingDean) {
      return res.status(400).json({ message: "Dean already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Use 10 rounds of salting

    // Create a new dean with the hashed password
    const newDean = new Auth({
      universityId,
      password: hashedPassword,
      name,
      userType,
    });
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

    const student = await Auth.findOne({ universityId });

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

    const dean = await Auth.findOne({
      universityId: universityId,
      userType: "dean",
    });

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
