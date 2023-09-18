const { promisify } = require('util');
const express = require("express");
const SSE = require('sse-express'); 
const Database = require("../configs/Database");
const router = express.Router();

const db = new Database();
const conn = db.connection;

router.get('/questions', async (req, res) => {
    const { program, competency } = req.query;

    // Use JOINs to fetch related data from program and competency tables
    let sql = `
      SELECT q.*, p.program_name, c.competency_name
      FROM question q
      LEFT JOIN programs p ON q.program_id = p.program_id
      LEFT JOIN competency c ON q.competency_id = c.competency_id
      WHERE 1
    `;

    const params = [];

    if (program) {
      sql += ' AND p.program_name = ?';
      params.push(program);
    }

    if (competency) {
      sql += ' AND c.competency_name = ?';
      params.push(competency);
    }

    try {
      // Connect to the database
      await conn.connect();

      conn.query(sql, params, (err, results) => {
        if (err) {
          console.error('Error executing SQL query:', err);
          res.status(500).json({ message: 'Internal server error' });
        } else {
          res.json(results);
        }
      });
    } catch (error) {
      console.error('Error connecting to the database:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      // Close the database connection
      conn.end();
    }
});

module.exports = router;
