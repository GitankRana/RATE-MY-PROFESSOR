const express = require("express");
const cors = require("cors");
const professorRoutes = require('./src/routes/professorRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const likeRoutes = require('./src/routes/likeRoutes');
require("dotenv").config();

const authRoutes = require("./src/routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/professors', professorRoutes);
app.use('/api/professors/:id/reviews', reviewRoutes);
app.use('/api/reviews', likeRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});