// questions.js
const { promisify } = require('util');
const express = require("express")
const Database = require("../configs/Database");
const router = express.Router();

const db = new Database();
const conn = db.connection;
(async () => {
  try {
    await conn.connect();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exit the application if database connection fails
  }
})();
const queryAsync = promisify(conn.query).bind(conn);

router.post("/create", async (req, res) => {
  try {
    const { question_text, program, competency, choices } = req.body;

    // Get program_id and competency_id based on predefined values
    const [programResult] = await queryAsync(
      "SELECT program_id FROM program WHERE program_name = ?",
      [program]
    );

    const [competencyResult] = await queryAsync(
      "SELECT competency_id FROM competency WHERE competency_name = ?",
      [competency]
    );

    const program_id = programResult ? programResult.program_id : null;
    const competency_id = competencyResult ? competencyResult.competency_id : null;

    // Insert the question into the database
    const result = await queryAsync(
      "INSERT INTO question (questionText, program_id, competency_id) VALUES (?, ?, ?)",
      [question_text, program_id, competency_id]
    );

    const question_id = result.insertId;

    if (choices && choices.length > 0) {
      for (const choice of choices) {
        const { choiceText, isCorrect } = choice;

        await queryAsync(
          'INSERT INTO choices (question_id, choiceText, isCorrect) VALUES (?, ?, ?)',
          [question_id, choiceText, isCorrect]
        );
      }
    }

    res.json({ message: "Question and choices created successfully", question_id });
  } catch (error) {
    console.error("Error creating question and choices:", error);
    res.status(500).json({ error: "Failed to create question and choices" });
  }
});

router.get("/fetch", async (req, res) => {
  const db = new Database();
  const conn = db.connection;
  const { program, competency } = req.query;

  // Define the base query to fetch questions and choices, including competency_id
  let query = `
    SELECT q.question_id, q.competency_id, q.questionText, c.choiceText, c.isCorrect
    FROM question AS q
    LEFT JOIN choices AS c ON q.question_id = c.question_id
  `;

  // Add filters for program and competency if provided
  const queryParams = [];
  if (program || competency) {
    query += ' WHERE';

    if (program) {
      query += ' q.program_id IN (SELECT program_id FROM program WHERE program_name LIKE ?)';
      queryParams.push(`%${program}%`);
    }

    if (competency) {
      if (program) {
        query += ' AND';
      }
      query += ' q.competency_id IN (SELECT competency_id FROM competency WHERE competency_name LIKE ?)';
      queryParams.push(`%${competency}%`);
    }
  }

  try {
    await conn.connect();

    conn.query(query, queryParams, (err, result) => {
      if (err) throw err;

      // Create an array to hold questions
      const questions = [];

      result.forEach((row) => {
        const questionId = row.question_id;
        const competencyId = row.competency_id;

        // Find the question in the array or create a new one
        let question = questions.find(q => q.question_id === questionId);
        if (!question) {
          question = {
            question_id: questionId,
            competency_id: competencyId,
            questionText: row.questionText,
            choices: [],
          };
          questions.push(question);
        }

        // Add choices to the respective question
        if (row.choiceText !== null) {
          question.choices.push({
            choiceText: row.choiceText,
            isCorrect: row.isCorrect,
          });
        }
      });

      res.json(questions);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    conn.end();
  }
});


router.get('/refresh', async (req, res) => {
  const db = new Database();
  const conn = db.connection;
  const { program, competency } = req.query;

  // Define the base query to fetch questions and choices, including competency_id
  let query = `
    SELECT q.question_id, q.competency_id, q.questionText, c.choiceText, c.isCorrect
    FROM question AS q
    LEFT JOIN choices AS c ON q.question_id = c.question_id
  `;

  // Add filters for program and competency if provided
  const queryParams = [];
  if (program || competency) {
    query += ' WHERE';

    if (program) {
      query += ' q.program_id IN (SELECT program_id FROM program WHERE program_name LIKE ?)';
      queryParams.push(`%${program}%`);
    }

    if (competency) {
      if (program) {
        query += ' AND';
      }
      query += ' q.competency_id IN (SELECT competency_id FROM competency WHERE competency_name LIKE ?)';
      queryParams.push(`%${competency}%`);
    }
  }

  try {
    await conn.connect();

    conn.query(query, queryParams, (err, result) => {
      if (err) throw err;

      // Create an array to hold questions
      const questions = [];

      result.forEach((row) => {
        const questionId = row.question_id;
        const competencyId = row.competency_id;

        // Find the question in the array or create a new one
        let question = questions.find(q => q.question_id === questionId);
        if (!question) {
          question = {
            question_id: questionId,
            competency_id: competencyId,
            questionText: row.questionText,
            choices: [],
          };
          questions.push(question);
        }

        // Add choices to the respective question
        if (row.choiceText !== null) {
          question.choices.push({
            choiceText: row.choiceText,
            isCorrect: row.isCorrect,
          });
        }
      });

      res.json(questions);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    conn.end();
  }
});




module.exports = router;