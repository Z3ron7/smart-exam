    const express = require("express");
    const Database = require("../configs/Database");
    const router = express.Router();

    // GET all exams
    router.get("/", async (req, res) => {
    const db = new Database();
    const conn = db.connection;
    const query = "SELECT * FROM Exams"; // Updated table name

    try {
        await conn.connect();

        conn.query(query, (err, result) => {
        if (err) throw err;
        res.json(result);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        conn.end();
    }
    });

    // GET exam by ID
    router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const db = new Database();
    const conn = db.connection;
    const query = "SELECT * FROM Exams WHERE exam_id = ?"; // Updated table name and column name

    try {
        await conn.connect();

        conn.query(query, [id], (error, rows) => {
        if (error) throw error;
        res.json(rows);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        conn.end();
    }
    });

    // POST add new exam
    router.post('/add', async (req, res) => {
    const { program_id, competency_id, time_duration, time_finished, date_taken, user_id } = req.body; // Updated fields

    if (!program_id || !competency_id || !time_duration || !time_finished || !date_taken || !user_id) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const db = new Database();
    const conn = db.connection;
    const query = "INSERT INTO Exams (program_id, competency_id, time_duration, time_finished, date_taken, user_id) VALUES (?, ?, ?, ?, ?, ?)";

    const values = [program_id, competency_id, time_duration, time_finished, date_taken, user_id];

    try {
        await conn.connect();

        conn.query(query, values, (error, result) => {
        if (error) throw error;
        res.json({ success: true, message: "Successfully added" });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        conn.end();
    }
    });

    // PUT update exam by ID
    router.put('/update/:id', async (req, res) => {
    const db = new Database();
    const conn = db.connection;

    const { id } = req.params;
    const { program_id, competency_id, time_duration, time_finished, date_taken, user_id } = req.body; // Updated fields

    const query = "UPDATE Exams SET program_id = ?, competency_id = ?, time_duration = ?, time_finished = ?, date_taken = ?, user_id = ? WHERE exam_id = ?"; // Updated table and column names
    const values = [program_id, competency_id, time_duration, time_finished, date_taken, user_id, id];

    try {
        await conn.connect();

        conn.query(query, values, (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Error updating exam' });
        } else {
            console.log(result);
            res.json({ message: "Exam updated successfully" });
        }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        conn.end();
    }
    });

    // DELETE exam by ID
    router.delete('/delete/:id', async (req, res) => {
    const db = new Database();
    const conn = db.connection;

    const { id } = req.params;
    const query = "DELETE FROM Exams WHERE exam_id = ?"; // Updated table and column names

    try {
        await conn.connect();

        conn.query(query, id, (error, result) => {
        if (error) throw error;
        console.log(result);
        res.json(result);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        conn.end();
    }
    });

    // Search route (if needed)
    router.get("/search/:name", async (req, res) => {
    // Implement search logic if needed
    res.status(501).json({ message: 'Not Implemented' });
    });

    module.exports = router;
