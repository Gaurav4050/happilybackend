const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const sessionRoutes = require("./routes/session");
const cors = require("cors");
const dotenv = require("dotenv");
const closeSessions = require("./closeSession");
const app = express();

//configure env
dotenv.config();

// Middleware for JSON request bodies
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use("/auth", authRoutes);
app.use("/session", sessionRoutes);

closeSessions();

// Start the server
const port = process.env.PORT || 3000;
console.log(process.env.PORT);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
