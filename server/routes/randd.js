const express = require("express");
const db = require("../config/db"); // ✅ This is your MySQL connection
const upload = require("../middleware/upload");

const router = express.Router();

// CREATE
router.post("/", upload.single("file"), (req, res) => {
  const {
    project,
    randdtype,
    title,
    url,
    description,
    priority,
    assignedTo,
    startDate,
    dueDate,
  } = req.body;
  const filePath = req.file ? req.file.path : null;
  const sql = `INSERT INTO randd 
    (project, randdtype, title, url, description, priority, assignedTo, startDate, dueDate, filePath) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    sql,
    [
      project,
      randdtype,
      title,
      url,
      description,
      priority,
      assignedTo,
      startDate,
      dueDate,
      filePath,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Insert Failed" });
      res
        .status(201)
        .json({ message: "R&D Created", randdId: result.insertId });
    }
  );
});

// READ ALL
router.get("/", (req, res) => {
  const sql = "SELECT * FROM randd";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching randd:", err);
      return res.status(500).json({ error: "Failed to fetch randd data" });
    }
    res.json(result);
  });
});

// COUNT
router.get("/count", (req, res) => {
  db.query("SELECT COUNT(*) AS total FROM randd", (err, result) => {
    if (err) return res.status(500).json({ error: "Count Failed" });
    res.json(result[0]);
  });
});

// READ ONE
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM randd WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0)
      return res.status(404).json({ error: "Not found" });
    res.json(result[0]);
  });
});

// UPDATE
// routes/randd.js or similar
router.put("/:id", upload.single("file"), (req, res) => {
  const randdId = req.params.id;
  const {
    project,
    randdtype,
    title,
    url,
    description,
    priority,
    assignedTo,
    startDate,
    dueDate,
  } = req.body;

  const filePath = req.file ? req.file.path : req.body.existingFilePath || null;

  const sql = `
    UPDATE randd SET
      project = ?, randdtype = ?, title = ?, url = ?, description = ?,
      priority = ?, assignedTo = ?, startDate = ?, dueDate = ?, filePath = ?
    WHERE id = ?
  `;

  const values = [
    project,
    randdtype,
    title,
    url,
    description,
    priority,
    assignedTo,
    startDate,
    dueDate,
    filePath,
    randdId,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Update error:", err);
      return res.status(500).json({ error: "Update Failed" });
    }
    res.json({ message: "Update successful" });
  });
});

// DELETE
router.delete("/:id", (req, res) => {
  const randdId = req.params.id;
  db.query("DELETE FROM randd WHERE id = ?", [randdId], (err) => {
    if (err) return res.status(500).json({ error: "Delete Failed" });
    res.json({ message: "Task Deleted" });
  });
});

// GET deleted task count
router.get("/count/deleted", (req, res) => {
  db.query(
    "SELECT COUNT(*) AS total FROM randd WHERE isDeleted = 1",
    (err, result) => {
      if (err) {
        console.error("Error fetching deleted count:", err);
        return res.status(500).json({ error: "Count Failed" });
      }
      res.json(result[0]);
    }
  );
});

module.exports = router;
