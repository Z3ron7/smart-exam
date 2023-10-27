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
    const query = 'SELECT user_id, name, gender, username, status, image FROM users WHERE status IN (?, ?) AND isVerified = ?';
    const statusFilter = ['student', 'alumni'];
    const isVerifiedValue = 1; // 1 for true

    const users = await queryAsync(query, [...statusFilter, isVerifiedValue]);
    res.json(users);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});


router.get('/users/:user_id', async (req, res) => {
  const userId = req.params.user_id; // Retrieve the userId from the URL parameters

  try {
    const query = 'SELECT user_id, name, gender, username, status, image FROM users WHERE user_id = ?';
    
    const user = await queryAsync(query, [userId]);
    
    if (user.length === 0) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.json(user[0]);
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
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
      const query = `
        SELECT status, isVerified, COUNT(*) AS count 
        FROM users 
        WHERE (isVerified = ? OR isVerified = ?)
        AND status IN (?, ?) 
        GROUP BY status, isVerified`;
  
      const isVerifiedTrue = 1; // 1 for true
      const isVerifiedFalse = 0; // 0 for false
      const statusFilter = ['student', 'alumni'];
  
      const results = await queryAsync(query, [isVerifiedTrue, isVerifiedFalse, ...statusFilter]);
  
      const userStats = {
        totalStudentsVerified: 0,
        totalAlumniVerified: 0,
        totalStudentsNotVerified: 0,
        totalAlumniNotVerified: 0,
      };
  
      results.forEach((row) => {
        if (row.status === 'student') {
          if (row.isVerified === isVerifiedTrue) {
            userStats.totalStudentsVerified = row.count;
          } else {
            userStats.totalStudentsNotVerified = row.count;
          }
        } else if (row.status === 'alumni') {
          if (row.isVerified === isVerifiedTrue) {
            userStats.totalAlumniVerified = row.count;
          } else {
            userStats.totalAlumniNotVerified = row.count;
          }
        }
      });
  
      res.json(userStats);
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      res.status(500).json({ error: 'An error occurred while fetching statistics' });
    }
  });
  
  
  
  module.exports = router;