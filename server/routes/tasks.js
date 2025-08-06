const express = require("express");
const connection = require("../config/db");
const upload = require("../middleware/upload");

const router = express.Router();

// CREATE
router.post("/", upload.single("file"), (req, res) => {
  const {
    project,
    taskType,
    title,
    url,
    description,
    priority,
    assignedTo,
    startDate,
    dueDate,
  } = req.body;
  const filePath = req.file ? req.file.path : null;

  const sql = `INSERT INTO tasks 
    (project, taskType, title, url, description, priority, assignedTo, startDate, dueDate, filePath) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  connection.query(
    sql,
    [
      project,
      taskType,
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
        .json({ message: "Task Created", taskId: result.insertId });
    }
  );
});

// READ ALL
router.get("/", (req, res) => {
  connection.query("SELECT * FROM tasks ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json({ error: "Fetch Failed" });
    res.json(results);
  });
});

// Add COUNT
router.get("/count", (req, res) => {
  connection.query("SELECT COUNT(*) AS total FROM tasks", (err, result) => {
    if (err) return res.status(500).json({ error: "Count Failed" });
    res.json(result[0]);
  });
});
// READ ONE
router.get("/:id", (req, res) => {
  const taskId = req.params.id;
  connection.query(
    "SELECT * FROM tasks WHERE id = ?",
    [taskId],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Fetch Failed" });
      if (results.length === 0)
        return res.status(404).json({ error: "Not Found" });
      res.json(results[0]);
    }
  );
});

// UPDATE
router.put("/:id", upload.single("file"), (req, res) => {
  const taskId = req.params.id;
  const {
    project,
    taskType,
    title,
    url,
    description,
    priority,
    assignedTo,
    startDate,
    dueDate,
  } = req.body;
  const filePath = req.file ? req.file.path : null;

  const sql = `UPDATE tasks SET
    project = ?, taskType = ?, title = ?, url = ?, description = ?, 
    priority = ?, assignedTo = ?, startDate = ?, dueDate = ?, filePath = ?
    WHERE id = ?`;

  connection.query(
    sql,
    [
      project,
      taskType,
      title,
      url,
      description,
      priority,
      assignedTo,
      startDate,
      dueDate,
      filePath,
      taskId,
    ],
    (err) => {
      if (err) return res.status(500).json({ error: "Update Failed" });
      res.json({ message: "Task Updated" });
    }
  );
});

// DELETE
router.delete("/:id", (req, res) => {
  const taskId = req.params.id;
  connection.query("DELETE FROM tasks WHERE id = ?", [taskId], (err) => {
    if (err) return res.status(500).json({ error: "Delete Failed" });
    res.json({ message: "Task Deleted" });
  });
});

// GET deleted task count
router.get("/count/deleted", (req, res) => {
  connection.query(
    "SELECT COUNT(*) AS total FROM tasks WHERE isDeleted = 1",
    (err, result) => {
      if (err) return res.status(500).json({ error: "Count Failed" });
      res.json(result[0]);
    }
  );
});

module.exports = router;
