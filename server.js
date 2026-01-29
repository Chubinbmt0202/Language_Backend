require("dotenv").config();
const express = require("express");
const cors = require("cors");
const apiRoutes = require("./src/routes/api");
const { loadDatabase } = require("./src/services/questionService");

const app = express();
const port = process.env.PORT || 9999;

// Middleware
app.use(cors());
app.use(express.json());

// Khởi tạo dữ liệu lần đầu
loadDatabase();

// Routes
app.use("/api", apiRoutes);

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});