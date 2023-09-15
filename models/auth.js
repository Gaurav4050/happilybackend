const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  universityId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ["student", "dean"], required: true },
  bookedSessions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Session" }],
});

module.exports = mongoose.model("Auth", studentSchema);
