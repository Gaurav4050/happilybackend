const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  universityId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  isDean: { type: Boolean, default: false },
});

module.exports = mongoose.model("Auth", studentSchema);
