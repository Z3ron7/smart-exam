// questions.js
const express = require("express");
const Database = require("../configs/Database");
const router = express.Router();

// Handle POST request to create a new question and choices
// Create a new question
router.post('/create', async (req, res) => {
  const db = new Database();
  const conn = db.connection;
  const { program, competency, questionText, answerText } = req.body;

  try {
    await conn.connect();
    await conn.beginTransaction();

    // Create a new question and get its question_id
    const questionQuery =
      'INSERT INTO question (questionText, program, competency, answer) VALUES (?, ?, ?, ?)';

    const result = await conn.query(
      questionQuery,
      [questionText, program, competency, answerText]
    );

    const question_id = result.insertId;

    // Commit the transaction
    await conn.commit();

    res.json({
      success: true,
      message: 'Data saved successfully',
      question_id: question_id,
    });
  } catch (error) {
    console.error(error);
    await conn.rollback();
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    conn.end();
  }
});

router.post('/choices/create/:questionId', async (req, res) => {
  const { questionId } = req.params;
  const { choices } = req.body;

  try {
    // Insert choices into the choices table associated with the given questionId
    if (choices && choices.length > 0) {
      for (const choice of choices) {
        const { choiceText, isCorrect } = choice;

        // Modify your database query to insert choices associated with the questionId
        await conn.query(
          'INSERT INTO choices (question_id, choiceText, is_correct) VALUES (?, ?, ?)',
          [questionId, choiceText, isCorrect]
        );
      }
    }

    res.json({
      success: true,
      message: 'Choices added successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




// Fetch all questions
router.get("/fetch", async (req, res) => {
  const db = new Database();
  const conn = db.connection;
  const query = "SELECT * FROM question";

  try {
    await conn.connect();

    conn.query(query, (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    conn.end();
  }
});

// Update a question by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Text cannot be empty' });
  }

  const db = new Database();
  const conn = db.connection;
  const query = "UPDATE Questions SET text = ? WHERE question_id = ?";
  const values = [text, id];

  try {
    await conn.connect();

    conn.query(query, values, (error, result) => {
      if (error) throw error;
      res.json({ message: "Question updated successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    conn.end();
  }
});

// Delete a question by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const db = new Database();
  const conn = db.connection;
  const query = "DELETE FROM Questions WHERE question_id = ?";

  try {
    await conn.connect();

    conn.query(query, id, (error, result) => {
      if (error) throw error;
      res.json({ message: "Question deleted successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    conn.end();
  }
});

module.exports = router;
