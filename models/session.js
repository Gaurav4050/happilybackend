const mongoose = require("mongoose");

const deanSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  status: { type: String, default: "open" },
  day: { type: String, enum: ["Thursday", "Friday"], required: true },
  time: { type: String, default: "10:00 AM" },
  date: { type: Date, required: true },
  credentials: {
    universityId: { type: String, required: true },
    name: { type: String, required: true },
  },
});

module.exports = mongoose.model("Sessions", deanSchema);
