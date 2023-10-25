const { promisify } = require('util');
const express = require('express');
const Database = require('../configs/Database');
const router = express.Router();

const db = new Database();
const conn = db.connection;

const queryAsync = promisify(conn.query).bind(conn);

router.post('/exam-room', async (req, res) => {
  try {
    const { room_id, user_id, program_id, competency_id, duration_minutes } = req.body;

    // Insert the user exam record
    const createExamQuery = `
      INSERT INTO exam_room (room_id, user_id, program_id, competency_id, duration_minutes, start_time)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;

    const createExamResult = await queryAsync(createExamQuery, [
      room_id,
      user_id,
      program_id,
      competency_id,
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

router.post('/end-exam-room', async (req, res) => {
  try {
    const { exam_id, score, total_duration_minutes, endTime } = req.body;

    // Update the exam record in the database, including the score, total_duration_minutes, and endTime
    const updateExamQuery = 'UPDATE exam_room SET end_time = ?, total_duration_minutes = ?, score = ? WHERE exam_room_id = ?';
    await queryAsync(updateExamQuery, [endTime, total_duration_minutes, score, exam_id]);

    res.status(200).json({ message: 'Exam ended successfully' });
  } catch (error) {
    console.error('Error ending exam:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/fetch-exam-room', async (req, res) => {
  const userId = req.query.userId;
  const limit = parseInt(req.query.limit, 10) || 2; // Parse the limit as an integer

  try {
    // Define a SQL query to fetch user exams with a LIMIT
    const query = `
      SELECT * FROM exam_room
      WHERE user_id = ?
      ORDER BY end_time DESC
    `;

    // Replace 'userId' with the actual user ID for whom you want to fetch exams

    const userExams = await queryAsync(query, [userId, limit]);
    // Fetch the score for the user
    const scoreQuery = `
      SELECT score FROM exam_room WHERE user_id = ?;
    `;

    const scoreResult = await queryAsync(scoreQuery, [userId]);
    const score = scoreResult[0].score;

    res.json({ userExams, score });
  } catch (error) {
    console.error('Error fetching user exams:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
