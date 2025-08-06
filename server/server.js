const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./server-db");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Routes
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/randd", require("./routes/randd"));

// Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
