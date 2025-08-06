const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connection = require("../config/db");

const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  connection.query("SELECT * FROM login WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "DB error" });
    if (results.length === 0) return res.status(401).json({ error: "Invalid email" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1m",
    });

    res.json({ token });
  });
});

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  connection.query("INSERT INTO login (email, password) VALUES (?, ?)", [email, hashedPassword], (err) => {
    if (err) return res.status(500).json({ error: "Registration error" });
    res.json({ message: "User registered!" });
  });
});

module.exports = router;
