const { promisify } = require('util');
const express = require('express');
const Database = require('../configs/Database');
const router = express.Router();

const db = new Database();
const conn = db.connection;

const queryAsync = promisify(conn.query).bind(conn);

// Create a user exam record
// Handle starting an exam for a user
router.post('/user-exams', async (req, res) => {
  try {
    const { user_id, program, competency, duration_minutes } = req.body;

    // Perform lookups to get program_id and competency_id based on names
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

    // Insert the user exam record
    const createExamQuery = `
      INSERT INTO user_exams (user_id, program_id, competency_id, duration_minutes, start_time, end_time)
      VALUES (?, ?, ?, ?, NOW(), NOW() + INTERVAL ? MINUTE)
    `;

    const createExamResult = await queryAsync(createExamQuery, [
      user_id,
      program_id,
      competency_id,
      duration_minutes,
      duration_minutes,
    ]);

    const userExamId = createExamResult.insertId;

    res.json({
      user_exam_id: userExamId,
    });
  } catch (error) {
    console.error('Error creating user exam:', error);
    res.status(500).json({ message: 'Failed to create user exam' });
  }
});




// Retrieve user exams for a specific user
router.get('/user-exams/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    const getUserExamsQuery = `
      SELECT * FROM exam WHERE user_id = ?
    `;

    const userExams = await queryAsync(getUserExamsQuery, [user_id]);

    res.json({ exam });
  } catch (error) {
    console.error('Error retrieving user exams:', error);
    res.status(500).json({ message: 'Failed to retrieve user exams' });
  }
});

// Update the is_correct field for a user exam
router.put('/user-exams/:user_exam_id', async (req, res) => {
  try {
    const { user_exam_id } = req.params;
    const { is_correct } = req.body;

    const updateIsCorrectQuery = `
      UPDATE exam SET is_correct = ? WHERE user_exam_id = ?
    `;

    await queryAsync(updateIsCorrectQuery, [is_correct, user_exam_id]);

    res.json({ message: 'Is_correct updated successfully' });
  } catch (error) {
    console.error('Error updating is_correct:', error);
    res.status(500).json({ message: 'Failed to update is_correct' });
  }
});

// Delete a user exam
router.delete('/user-exams/:user_exam_id', async (req, res) => {
  try {
    const { user_exam_id } = req.params;

    const deleteExamQuery = `
      DELETE FROM exam WHERE user_exam_id = ?
    `;

    await queryAsync(deleteExamQuery, [user_exam_id]);

    res.json({ message: 'User exam deleted successfully' });
  } catch (error) {
    console.error('Error deleting user exam:', error);
    res.status(500).json({ message: 'Failed to delete user exam' });
  }
});

router.post('/record_exam_choices', async (req, res) => {
  try {
    const { userId, examId, questionId, choiceId, isCorrect } = req.body;

    // Insert a record into the user_exam_records table
    const insertQuery = `
      INSERT INTO user_exam_records (user_id, exam_id, question_id, choice_id, is_correct)
      VALUES (?, ?, ?, ?, ?)
    `;

    await queryAsync(insertQuery, [userId, examId, questionId, choiceId, isCorrect]);

    res.status(200).json({ message: 'Exam choices recorded successfully' });
  } catch (error) {
    console.error('Error recording exam choices:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/total-scores', async (req, res) => {
  try {
    const { user_id } = req.body;

    // Calculate the user's total score and total duration_minutes
    const { totalScore, totalDurationMinutes } = await calculateUserScore(user_id);

    // Update the total_scores table with the user's score and duration
    await queryAsync(
      'UPDATE total_scores SET total_score = ?, total_duration_minutes = ?, updated_at = NOW() WHERE user_id = ?',
      [totalScore, totalDurationMinutes, user_id]
    );

    res.json({ message: 'Total scores updated successfully' });
  } catch (error) {
    console.error('Error updating total scores:', error);
    res.status(500).json({ message: 'Failed to update total scores' });
  }
});



module.exports = router;
