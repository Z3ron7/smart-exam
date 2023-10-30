const { promisify } = require('util');
const express = require('express');
const Database = require('../configs/Database');
const router = express.Router();

const db = new Database();
const conn = db.connection;

const queryAsync = promisify(conn.query).bind(conn);

router.get('/fetch-latest', async (req, res) => {
  const user_id = req.query.userId; // Use req.query to access the query parameter
  const limit = parseInt(req.query.limit, 10) || 1; // Default limit is 1 if not specified

  try {
    // Define a SQL query to fetch the latest activity from both tables, limited to the specified limit
    const query = `
      SELECT * FROM (SELECT user_id, program_id, competency_id, 
                    end_time, score 
                    FROM user_exams
                    WHERE user_id = ?
                    UNION
                    SELECT user_id, program_id, competency_id, 
                    end_time, score 
                    FROM exam_room) AS combined
      ORDER BY end_time DESC
      LIMIT ?;`;
  
    const latestActivity = await queryAsync(query, [user_id, limit]);

    // Set the score variable to the score field of the first record
    const score = latestActivity.length > 0 ? latestActivity[0].score : null;

    res.json({ latestActivity, score });
  } catch (error) {
    console.error('Error fetching latest activities:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

  
module.exports = router;
