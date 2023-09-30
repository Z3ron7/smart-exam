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
    const { user_id, program_id, competency_id, duration_minutes } = req.body;

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

    // Calculate the user's total score and total duration_minutes
    const { totalScore, totalDurationMinutes } = await calculateUserScore(user_id);

    res.json({
      user_exam_id: userExamId,
      total_score: totalScore,
      total_duration_minutes: totalDurationMinutes,
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

router.post('/submit-answers', async (req, res) => {
  try {
    const { answers, user_exam_id } = req.body;

    // Calculate the user's score for the completed exam
    let totalScore = 0;

    for (const answer of answers) {
      // Assume answers contain { question_id, choice_id, is_correct }
      if (answer.is_correct) {
        // Increase the total score when the answer is correct
        totalScore++;
      }
    }

    // Update the `user_exams` table with the user's score
    const updateExamQuery = `
      UPDATE user_exams SET is_correct = ? WHERE user_exam_id = ?
    `;

    for (const answer of answers) {
      await queryAsync(updateExamQuery, [answer.is_correct, user_exam_id]);
    }

    // Calculate the total duration of all exams taken by the user
    const totalDurationQuery = `
      SELECT SUM(duration_minutes) AS total_duration_minutes FROM user_exams WHERE user_id = ?
    `;

    // Retrieve the user_id from localStorage
    const user_id = localStorage.getItem('user_id'); // Replace with your actual localStorage key

    const totalDurationResult = await queryAsync(totalDurationQuery, [user_id]);
    const totalDurationMinutes = totalDurationResult[0].total_duration_minutes || 0;

    // Update the `total_scores` table with the calculated total score, total duration, and exam count
    const updateTotalScoreQuery = `
      UPDATE total_scores
      SET total_score = ?, total_duration_minutes = ?, exam_count = exam_count + 1
      WHERE user_id = ?
    `;

    await queryAsync(updateTotalScoreQuery, [totalScore, totalDurationMinutes, user_id]);

    // Return the updated user score to the frontend
    res.json({ updatedScore: totalScore });
  } catch (error) {
    console.error('Error submitting answers:', error);
    res.status(500).json({ message: 'Failed to submit answers' });
  }
});

module.exports = router;
