const { promisify } = require('util');
const express = require('express');
const Database = require('../configs/Database');
const router = express.Router();

const db = new Database();
const conn = db.connection;

const queryAsync = promisify(conn.query).bind(conn);

router.post('/exam-room', async (req, res) => {
  try {
    const { room_id, user_id, program, competency, duration_minutes } = req.body;

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
      INSERT INTO exam_room (room_id, user_id, program_id, competency_id, duration_minutes, start_time)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;

    const createExamResult = await queryAsync(createExamQuery, [
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
    const updateExamQuery = 'UPDATE exam_room SET end_time = ?, total_duration_minutes = ?, score = ? WHERE exam_id = ?';
    await queryAsync(updateExamQuery, [endTime, total_duration_minutes, score, exam_id]);

    res.status(200).json({ message: 'Exam ended successfully' });
  } catch (error) {
    console.error('Error ending exam:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
