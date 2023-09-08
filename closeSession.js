// closeSessions.js
const cron = require("node-cron");

function closeSessions() {
  // this function will run every day on 11.00 AM
  cron.schedule("0 11 * * *", async () => {
    try {
      const currentTime = new Date();

      // Fetch all Dean documents
      const deans = await Dean.find({});

      // Iterate through each Dean
      for (const dean of deans) {
        // Filter sessions that are still open and have a date and time earlier than the current time
        const sessionsToClose = dean.sessions.filter(
          (session) => session.status === "open" && session.date < currentTime
        );

        // Close sessions for this Dean
        for (const session of sessionsToClose) {
          session.status = "closed";
        }

        // Save the updated Dean document
        await dean.save();

        console.log(
          `Closed sessions for Dean ${dean.universityId}:`,
          sessionsToClose
        );
      }
    } catch (error) {
      console.error("Error closing sessions:", error);
    }
  });
}

module.exports = closeSessions;
