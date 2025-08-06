const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "next_project",
});

connection.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.stack);
    return;
  }
  console.log("✅ MySQL connected:", connection.threadId);
});

module.exports = connection;
