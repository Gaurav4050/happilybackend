const Session = require("../models/session");
const Student = require("../models/student");

// creating session
exports.createSession = async (req, res) => {
  try {
    const { day, date } = req.body;

    // Create a new session
    const session = new Session({ day, date });

    // Save the session to the database
    await session.save();

    res.status(201).json({ message: "Session created successfully", session });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// session list which are open
exports.getOpenSession = async (req, res) => {
  try {
    // find all session which are open
    const openSessions = await Session.find({ status: "open" });

    res.json({ openSessions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Book Session
exports.bookSession = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const sessionId = req.params.sessionId;

    // Check if the student and session exist
    const student = await Student.findById(studentId);
    const session = await Session.findById(sessionId);

    if (!student || !session) {
      return res.status(404).json({ message: "Student or session not found" });
    }

    // Check if the session is open for booking
    if (session.status !== "open") {
      return res
        .status(400)
        .json({ message: "Session is not open for booking" });
    }

    // Update the session status to "booked" and associate it with the student
    session.status = "pending";
    session.studentId = studentId;
    await session.save();

    res.json({ message: "Session booked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get all booked session whose status is pending

exports.getBookedSession = async (req, res) => {
  try {
    // Find all sessions with status "booked" and populate the student details
    const bookedSessions = await Session.find({ status: "pending" }).populate({
      path: "studentId",
      select: "universityId name",
    });

    res.json({ bookedSessions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
