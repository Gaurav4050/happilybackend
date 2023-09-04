// closeSessions.js
const Session = require("./models/session");
const cron = require("node-cron");

function closeSessions() {
  cron.schedule("0 11 * * *", async () => {
    try {
      const currentTime = new Date();

      // Find sessions that are still open and have a date and time earlier than the current time
      const sessionsToClose = await Session.find({
        status: "open",
        date: { $lt: currentTime },
      });

      // Close sessions
      for (const session of sessionsToClose) {
        session.status = "closed";
        await session.save();
      }

      console.log("Closed sessions:", sessionsToClose);
    } catch (error) {
      console.error("Error closing sessions:", error);
    }
  });
}

module.exports = closeSessions;
