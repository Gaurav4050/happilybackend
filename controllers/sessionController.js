const Session = require("../models/session");
const Auth = require("../models/auth");
const bcrypt = require("bcrypt");

// creating session
exports.createSession = async (req, res) => {
  const { universityId, password, day, date } = req.body;

  try {
    // Verify dean's credentials
    const dean = await Auth.findOne({
      universityId,
      userType: "dean",
    });

    if (!dean) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, dean.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    if (day !== "Friday" && day !== "Thursday") {
      return res
        .status(500)
        .json({ message: "Day must be either Friday or Thursday" });
    }

    // Create a new session
    const newSession = new Session({
      dean: universityId,
      day,
      date,
    });

    // Create a new session
    // newSession.deanId = universityId;

    // Save the session to the database
    await newSession.save();

    return res
      .status(200)
      .json({ message: "Session created successfully", session: newSession });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// session list which are open
exports.getOpenSession = async (req, res) => {
  try {
    const openSessions = await Session.find({ status: "open" });

    if (openSessions.length === 0) {
      return res.status(400).json({ message: "No open session is available" });
    }
    return res.status(200).json(openSessions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Book Session
exports.bookSession = async (req, res) => {
  const { universityId, password, sessionId } = req.body;

  try {
    // Verify student's credentials
    const student = await Auth.findOne({
      universityId,
      userType: "student",
    });

    if (!student) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if the session exists and is open
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status === "booked") {
      return res.status(400).json({ message: "Session already booked" });
    }

    // Add the session to the student's booked sessions
    student.bookedSessions.push(sessionId);
    await student.save();

    // Update session status to 'booked'
    session.status = "booked";

    // Add the student to the session's bookedBy
    session.bookedBy = {
      universityId: student.universityId,
    };

    await session.save();

    return res.status(200).json({ message: "Session booked successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get all booked session whose status is pending

exports.getBookedSession = async (req, res) => {
  const { deanUniversityId, password } = req.body;

  try {
    // Verify dean's credentials
    const dean = await Auth.findOne({
      universityId: deanUniversityId,
      userType: "dean",
    });

    if (!dean) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, dean.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    // Retrieve sessions created by the dean
    const sessions = await Session.find({
      dean: deanUniversityId,
      status: "booked",
    }).populate("bookedBy", "universityId");

    return res.status(200).json(sessions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
