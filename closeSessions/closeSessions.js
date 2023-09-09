// closeSessions.js

const cron = require("node-cron");
const Session = require("../models/session");

function closeSessions() {
  // this function will run every day on 11.00 AM
  cron.schedule("0 11 * * *", async () => {
    try {
      const currentTime = new Date();

      // Fetch all session documents
      const sessions = await Session.find({});

      // Iterate through each session
      for (const session of sessions) {
        // Check if the session is still open and has a date and time earlier than the current time
        if (session.status === "open" && session.date < currentTime) {
          // Close the session
          session.status = "closed";
          await session.save();

          console.log(
            `Closed session for University ID ${session.credentials.universityId}:`,
            session
          );
        }
      }
    } catch (error) {
      console.error("Error closing sessions:", error);
    }
  });
}

module.exports = closeSessions;
