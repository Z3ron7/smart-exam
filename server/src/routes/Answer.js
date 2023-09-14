const express = require("express");
const Database = require("../configs/Database");
const router = express.Router();

// Create a new answer
router.post("/create", async (req, res) => {
  const { question_id, text } = req.body;

  if (!question_id || !text) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const db = new Database();
  const conn = db.connection;
  const query = "INSERT INTO Answer (question_id, text) VALUES (?, ?)";

  const values = [question_id, text];

  try {
    await conn.connect();

    conn.query(query, values, (error, result) => {
      if (error) throw error;
      res.json({ success: true, message: "Answer created successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    conn.end();
  }
});


// Read all answers for a specific question
router.get("/question/:questionId", async (req, res) => {
  const { questionId } = req.params;
  const db = new Database();
  const conn = db.connection;
  const query = "SELECT * FROM Answers WHERE question_id = ?";

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

// Update an answer by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { text, is_correct } = req.body;

  if (!text || !is_correct) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const db = new Database();
  const conn = db.connection;
  const query = "UPDATE Answers SET text = ?, is_correct = ? WHERE answer_id = ?";
  const values = [text, is_correct, id];

  try {
    await conn.connect();

    conn.query(query, values, (error, result) => {
      if (error) throw error;
      res.json({ message: "Answer updated successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    conn.end();
  }
});

// Delete an answer by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const db = new Database();
  const conn = db.connection;
  const query = "DELETE FROM Answers WHERE answer_id = ?";

  try {
    await conn.connect();

    conn.query(query, id, (error, result) => {
      if (error) throw error;
      res.json({ message: "Answer deleted successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    conn.end();
  }
});

module.exports = router;
