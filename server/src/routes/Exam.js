const express = require("express");
const router = express.Router();
const { promisify } = require("util");
const Database = require("../configs/Database");

const db = new Database();
const conn = db.connection;

// Promisify database query functions
const query = promisify(conn.query).bind(conn);

// Fetch all exams
router.get("/exams", async (req, res) => {
  try {
    const exams = await query("SELECT * FROM exam");
    res.json({ exams });
  } catch (error) {
    console.error("Error fetching exams:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch an exam by ID
router.get("/exams/:exam_id", async (req, res) => {
  const examId = req.params.exam_id;
  try {
    const exam = await query("SELECT * FROM exam WHERE exam_id = ?", [examId]);
    if (exam.length === 0) {
      res.status(404).json({ error: "Exam not found" });
    } else {
      res.json({ exam: exam[0] });
    }
  } catch (error) {
    console.error("Error fetching exam by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/exams/submit", async (req, res) => {
    const { examResults, totalScore } = req.body;
  
    try {
      // Iterate through the exam results and update the 'choices' table
      await Promise.all(
        examResults.map(async (result) => {
          // Get the 'question_id' and 'is_correct' from the 'choices' table
          const queryResult = await query(
            "SELECT question_id, is_correct FROM choices WHERE choice_id = ?",
            [result.selected_choice]
          );
          const { question_id, is_correct } = queryResult[0];
  
          // Insert the result into the 'exam' table
          await query(
            "INSERT INTO exam (users_id, program_id, competency_id, question_id, start_time, end_time, total_score) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [req.user.id, req.user.program_id, req.user.competency_id, question_id, req.user.start_time, req.user.end_time, totalScore]
          );
  
          // Update the 'choices' table to mark the selected choice as 'used'
          await query(
            "UPDATE choices SET is_used = 1 WHERE choice_id = ?",
            [result.selected_choice]
          );
        })
      );
  
      res.json({ message: "Exam results submitted successfully" });
    } catch (error) {
      console.error("Error submitting exam results:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

// Create a new exam
router.post("/exams", async (req, res) => {
  const { users_id, program_id, competency_id, start_time, end_time, total_score } = req.body;
  try {
    const result = await query(
      "INSERT INTO exam (users_id, program_id, competency_id, start_time, end_time, total_score) VALUES (?, ?, ?, ?, ?, ?)",
      [users_id, program_id, competency_id, start_time, end_time, total_score]
    );
    res.json({ message: "Exam created", exam_id: result.insertId });
  } catch (error) {
    console.error("Error creating exam:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update an exam by ID
router.put("/exams/:exam_id", async (req, res) => {
  const examId = req.params.exam_id;
  const { users_id, program_id, competency_id, start_time, end_time, total_score } = req.body;
  try {
    const result = await query(
      "UPDATE exam SET users_id = ?, program_id = ?, competency_id = ?, start_time = ?, end_time = ?, total_score = ? WHERE exam_id = ?",
      [users_id, program_id, competency_id, start_time, end_time, total_score, examId]
    );
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Exam not found" });
    } else {
      res.json({ message: "Exam updated" });
    }
  } catch (error) {
    console.error("Error updating exam:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete an exam by ID
router.delete("/exams/:exam_id", async (req, res) => {
  const examId = req.params.exam_id;
  try {
    const result = await query("DELETE FROM exam WHERE exam_id = ?", [examId]);
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Exam not found" });
    } else {
      res.json({ message: "Exam deleted" });
    }
  } catch (error) {
    console.error("Error deleting exam:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
