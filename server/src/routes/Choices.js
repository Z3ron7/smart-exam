// choices.js
const express = require("express");
const Database = require("../configs/Database");
const router = express.Router();

// Create a new choice
router.post("/create", async (req, res) => {
  const { question_id, text } = req.body;

  if (!question_id || !text) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const db = new Database();
  const conn = db.connection;
  const query = "INSERT INTO Choices (question_id, text) VALUES (?, ?)";

  const values = [question_id, text];

  try {
    await conn.connect();

    conn.query(query, values, (error, result) => {
      if (error) throw error;
      res.json({ success: true, message: "Choice created successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    conn.end();
  }
});


// Read all choices for a specific question
router.get("/question/:questionId", async (req, res) => {
  const { questionId } = req.params;
  const db = new Database();
  const conn = db.connection;
  const query = "SELECT * FROM Choices WHERE question_id = ?";

  try {
    await conn.connect();

    conn.query(query, [questionId], (error, rows) => {
      if (error) throw error;
      res.json(rows);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    conn.end();
  }
});

// Update a choice by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Text cannot be empty' });
  }

  const db = new Database();
  const conn = db.connection;
  const query = "UPDATE Choices SET text = ? WHERE choice_id = ?";
  const values = [text, id];

  try {
    await conn.connect();

    conn.query(query, values, (error, result) => {
      if (error) throw error;
      res.json({ message: "Choice updated successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    conn.end();
  }
});

// Delete a choice by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const db = new Database();
  const conn = db.connection;
  const query = "DELETE FROM Choices WHERE choice_id = ?";

  try {
    await conn.connect();

    conn.query(query, id, (error, result) => {
      if (error) throw error;
      res.json({ message: "Choice deleted successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    conn.end();
  }
});

module.exports = router;
