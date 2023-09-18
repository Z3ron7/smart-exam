// Define or import your database connection and queryAsync function
const { promisify } = require('util');
const express = require("express");
const Database = require("../configs/Database");
const router = express.Router();

const db = new Database();
const conn = db.connection;
const queryAsync = promisify(conn.query).bind(conn);
// API endpoint to insert data into the "program" table
router.post('/program', async (req, res) => {
    const { programName } = req.body;
    const db = new Database();
    const conn = db.connection;
  
    try {
      await conn.connect();
  
      const insertQuery = 'INSERT INTO programs (program_name) VALUES (?)';
  
      // Insert programName into the "program" table
      const result = await queryAsync(insertQuery, [programName]);
  
      const program_id = result.insertId;
  
      await conn.commit();
  
      res.json({
        success: true,
        message: 'Program data saved successfully',
        program_id: program_id,
      });
    } catch (error) {
      console.error(error);
      await conn.rollback();
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      conn.end();
    }
  });

  router.post('/competency', async (req, res) => {
    const { competencyName } = req.body;
    const db = new Database();
    const conn = db.connection;
  
    try {
      await conn.connect();
  
      const insertQuery = 'INSERT INTO competency (competency_name) VALUES (?)';
  
      // Insert competencyName into the "competency" table
      const result = await queryAsync(insertQuery, [competencyName]);
  
      const competency_id = result.insertId;
  
      await conn.commit();
  
      res.json({
        success: true,
        message: 'Competency data saved successfully',
        competency_id: competency_id,
      });
    } catch (error) {
      console.error(error);
      await conn.rollback();
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      conn.end();
    }
  });
  


// Export the functions
module.exports = router;
