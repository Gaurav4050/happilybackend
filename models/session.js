const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  status: { type: String, enum: ["open", "booked", "closed"], default: "open" },

  // deanId who created the session
  dean: { type: String, required: true },

  // name and universtiy id of the student who booked the session
  bookedBy: {
    universityId: { type: String },
  },

  date: { type: Date, required: true },
  time: { type: String, default: "10:00 AM" },
  day: { type: String, enum: ["Thursday", "Friday"], required: true },
});

module.exports = mongoose.model("Sessions", sessionSchema);
