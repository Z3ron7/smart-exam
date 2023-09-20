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

// Create an SSE stream

// Add SSE middleware to your Express router
router.post('/create', async (req, res) => {
  const { programName, competencyName, questionText, answerText } = req.body;

  try {
    // Create the program first
    const programResult = await queryAsync(
      'INSERT INTO programs (program_name) VALUES (?)',
      [programName]
    );

    const programId = programResult.insertId;

    // Create the competency
    const competencyResult = await queryAsync(
      'INSERT INTO competency (competency_name) VALUES (?)',
      [competencyName]
    );

    const competencyId = competencyResult.insertId;

    // Now, insert the question into the database with program_id and competency_id
    const questionQuery =
      'INSERT INTO question (questionText, program_id, competency_id, answer) VALUES (?, ?, ?, ?)';

    const result = await queryAsync(questionQuery, [
      questionText,
      programId,
      competencyId,
      answerText,
    ]);

    const question_id = result.insertId;
    res.json({
      success: true,
      message: 'Data saved successfully',
      question_id: question_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/choices/create/:question_id', async (req, res) => {
  const { question_id } = req.params;
  const { choices } = req.body;

  try {
    if (choices && choices.length > 0) {
      for (const choice of choices) {
        const { choiceText, isCorrect } = choice;

        await queryAsync(
          'INSERT INTO choices (question_id, choiceText, is_correct) VALUES (?, ?, ?)',
          [question_id, choiceText, isCorrect]
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
  
  const query = `
    SELECT q.*, c.choiceText, c.is_correct
    FROM question AS q
    LEFT JOIN choices AS c ON q.question_id = c.question_id
  `;

  try {
    await conn.connect();

    conn.query(query, (err, result) => {
      if (err) throw err;

      // Organize the data into a more suitable structure
      const questions = {};

      result.forEach((row) => {
        const questionId = row.question_id;

        // If the question doesn't exist in the questions object, create it
        if (!questions[questionId]) {
          questions[questionId] = {
            questionText: row.questionText,
            program: row.program,
            competency: row.competency,
            answer: row.answer,
            choices: [],
          };
        }

        // Add choices to the respective question
        if (row.choiceText !== null) {
          questions[questionId].choices.push({
            choiceText: row.choiceText,
            is_correct: row.is_correct,
          });
        }
      });

      // Convert the object into an array of questions
      const questionArray = Object.values(questions);

      res.json(questionArray);
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

  const query = `
    SELECT q.*, c.choiceText, c.is_correct
    FROM question AS q
    LEFT JOIN choices AS c ON q.question_id = c.question_id
  `;

  try {
    await conn.connect();

    conn.query(query, (err, result) => {
      if (err) throw err;

      // Organize the data into a more suitable structure
      const questions = {};

      result.forEach((row) => {
        const questionId = row.question_id;

        // If the question doesn't exist in the questions object, create it
        if (!questions[questionId]) {
          questions[questionId] = {
            questionText: row.questionText,
            program: row.program,
            competency: row.competency,
            answer: row.answer,
            choices: [],
          };
        }

        // Add choices to the respective question
        if (row.choiceText !== null) {
          questions[questionId].choices.push({
            choiceText: row.choiceText,
            is_correct: row.is_correct,
          });
        }
      });

      // Convert the object into an array of questions
      const questionArray = Object.values(questions);

      res.json(questionArray);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    conn.end();
  }
});


module.exports = router;
