const Dean = require("../models/dean");
const Student = require("../models/student");

// creating session
exports.createSession = async (req, res) => {
  try {
    const { day, date } = req.body;
    const { deanid } = req.params;

    if (day !== "Friday" && day !== "Thursday") {
      return res
        .status(500)
        .json({ message: "Day must be either Friday or Thursday" });
    }

    const dean = await Dean.findById(deanid);

    if (!dean) {
      return res.status(500).json({ message: "Wrong Credentials" });
    }

    // Create a new session
    const session = {
      status: "open",
      day,
      time: "10.00 AM",
      date,
    };

    dean.sessions.push(session);

    // Save the session to the database
    await dean.save();

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
    const openSessions = await Dean.find({ "sessions.status": "open" });

    const Sessions = [];

    // Iterate through each Dean document
    openSessions.forEach((dean) => {
      // Filter the sessions with status "open" for each Dean
      const deanOpenSessions = dean.sessions.filter(
        (session) => session.status === "open"
      );

      // Add the filtered sessions to the openSessions array
      Sessions.push(...deanOpenSessions);
    });
    res.json({ openSessions: Sessions });
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
    const dean = await Dean.findOne({ "sessions._id": sessionId }); // Use findOne to find the dean with the session

    if (!student || !dean) {
      return res.status(404).json({ message: "Student or session not found" });
    }

    // Find the specific session within the dean
    const session = dean.sessions.find((s) => s._id.toString() === sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
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
    await dean.save();

    res.json({ message: "Session booked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get all booked session whose status is pending

exports.getBookedSession = async (req, res) => {
  try {
    // Find all Deans with sessions having status "pending" and populate the student details
    const bookedSessions = await Dean.find({
      "sessions.status": "pending",
    }).populate({
      path: "sessions.studentId",
      select: "universityId name",
    });

    // console.log(bookedSessions.length == 0);

    if (bookedSessions.length === 0) {
      return res
        .status(400)
        .json({ message: "No Pending Session is available" });
    }

    const pendingSessions = bookedSessions.map((dean) => ({
      deanId: dean._id,
      sessions: dean.sessions.filter((session) => session.status === "pending"),
    }));

    res.json({ pendingSessions: pendingSessions[0].sessions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
