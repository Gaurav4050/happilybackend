const mongoose = require("mongoose");

const deanSchema = new mongoose.Schema({
  universityId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("Dean", deanSchema);
