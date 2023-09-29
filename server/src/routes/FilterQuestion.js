const { promisify } = require('util');
const express = require("express");
const SSE = require('sse-express'); 
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

router.get("/filterQuestions", async (req, res) => {
  try {
    const { program, competency } = req.query;

    // Build a SQL query to filter questions by program and competency
    let sqlQuery = `
      SELECT q.*
      FROM question AS q
      INNER JOIN program AS p ON q.program_id = p.program_id
      INNER JOIN competency AS c ON q.competency_id = c.competency_id
    `;
    
    const queryParams = [];

    if (program) {
      sqlQuery += ' WHERE p.program_name LIKE ?';
      queryParams.push(`%${program}%`);
    }

    if (competency && competency !== 'All Competency') {
      if (queryParams.length > 0) {
        sqlQuery += ' AND';
      } else {
        sqlQuery += ' WHERE';
      }
      sqlQuery += ' c.competency_name LIKE ?';
      queryParams.push(`%${competency}%`);
    }

    const result = await queryAsync(sqlQuery, queryParams);

    res.json(result);
  } catch (error) {
    console.error('Error filtering questions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
