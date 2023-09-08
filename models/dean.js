const mongoose = require("mongoose");

const deanSchema = new mongoose.Schema({
  universityId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  sessions: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
      status: { type: String, default: "open" },
      day: { type: String, enum: ["Thursday", "Friday"], required: true },
      time: { type: String, default: "10:00 AM" },
      date: { type: Date, required: true },
    },
  ],
});

module.exports = mongoose.model("Dean", deanSchema);
