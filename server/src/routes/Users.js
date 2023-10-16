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

router.get('/users', async (req, res) => {
    try {
      const query = 'SELECT user_id, name, gender, username, status FROM users WHERE status IN (?, ?)';
      const statusFilter = ['student', 'alumni'];
  
      const users = await queryAsync(query, statusFilter);
      res.json(users);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'An error occurred while fetching data' });
    }
  });
  
  router.delete('/users/:user_id', async (req, res) => {
    try {
      const { user_id } = req.params;
      
      const deleteQuery = 'DELETE FROM users WHERE user_id = ?';
      
      // Execute the delete query
      const result = await queryAsync(deleteQuery, [user_id]);
      
      if (result.affectedRows === 1) {
        // Row deleted successfully
        res.json({ message: 'User deleted successfully' });
      } else {
        // No rows were affected, meaning the user wasn't found
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'An error occurred while deleting the user' });
    }
  });

  router.get('/user-stats', async (req, res) => {
    try {
      const query = 'SELECT status, COUNT(*) AS count FROM users GROUP BY status';
      const results = await queryAsync(query);
      
      const userStats = {
        totalUsers: 0,
        totalStudents: 0,
        totalAlumni: 0,
      };
  
      results.forEach((row) => {
        if (row.status === 'admin') {
          userStats.totalUsers += row.count;
        } else if (row.status === 'student') {
          userStats.totalStudents += row.count;
          userStats.totalUsers += row.count;
        } else if (row.status === 'alumni') {
          userStats.totalAlumni += row.count;
          userStats.totalUsers += row.count;
        }
      });
  
      res.json(userStats);
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      res.status(500).json({ error: 'An error occurred while fetching statistics' });
    }
  });
  
  module.exports = router;