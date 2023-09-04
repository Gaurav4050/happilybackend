const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  status: { type: String, default: "open" },
  day: { type: String, enum: ["Thursday", "Friday"], required: true },
  time: { type: String, default: "10:00 AM" },
  date: { type: Date, required: true },
});

module.exports = mongoose.model("Session", sessionSchema);
