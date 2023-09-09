const Session = require("../models/session");
const Auth = require("../models/auth");

// creating session
exports.createSession = async (req, res) => {
  try {
    const { day, date } = req.body;

    if (day !== "Friday" && day !== "Thursday") {
      return res
        .status(500)
        .json({ message: "Day must be either Friday or Thursday" });
    }

    // Create a new session
    const session = new Session({
      day,
      date,
    });

    // Find the dean who created the session
    const dean = await Auth.findById(req.user.userId);

    if (!dean) {
      return res.status(404).json({ message: "Dean not found" });
    }

    // Add the session to the dean's information to the session
    session.credentials.push({
      universityId: dean.universityId,
      name: dean.name,
    });

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

    if (openSessions.length === 0) {
      return res.status(400).json({ message: "No open session is available" });
    }

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
    const student = await Auth.findById(studentId);
    const session = await Session.findById(sessionId); // Use findOne to find the dean with the session

    if (!student || !session) {
      return res.status(404).json({ message: "Student or session not found" });
    }

    // Check if the session is open for booking
    if (session.status !== "open") {
      return res
        .status(400)
        .json({ message: "Session is not open for booking" });
    }

    // Update the session status to "pending" and associate it with the student
    session.status = "pending";
    session.studentId = studentId;

    // Save the updated dean document
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
    // Find all sessions with status "pending" and populate the student details
    const bookedSessions = await Session.find({ status: "pending" })
      .populate({
        path: "studentId",
        model: Auth,
        select: "universityId name",
      })
      .select("-credentials -__v");

    if (bookedSessions.length === 0) {
      return res.status(404).json({ message: "No pending sessions available" });
    }

    res.json({ bookedSessions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
