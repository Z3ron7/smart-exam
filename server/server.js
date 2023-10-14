const express = require("express");
const Database = require("./src/configs/Database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const salt = 5;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    method: ["POST", "GET"],
    credentials: true,
  })
);

const examsRouter = require("./src/routes/Exam");
const questionsRouter = require("./src/routes/Questions"); // Add this
const choicesRouter = require("./src/routes/Choices");
const programRouter = require("./src/routes/Program");
const filterRouter = require ("./src/routes/FilterQuestion")

app.use("/exams", examsRouter);
app.use("/questions", questionsRouter); // Add this
app.use("/choices", choicesRouter); // Add this
app.use("/category", programRouter); // Add this
app.use("/filter", filterRouter); // Add this

app.use(cookieParser());

const db = new Database();
const conn = db.connection;

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Error: "You are not authenticated" });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ Error: "Token is not valid" });
      } else {
        req.user = {
          id: decoded.user_id, // Attach user_id to req.user
          name: decoded.name, // Attach other user data if needed
        };
        next();
      }
    });
  }
};
app.get("/", verifyUser, (req, res) => {
  return res.json({ Status: "Success", name: req.name });
});

app.post('/register', async (req, res) => {
  const { name, username, password, status } = req.body;
  
  try {
    // Validate incoming data
    if (!name || !username || !password || !status) {
      return res.status(400).json({ Error: "Missing required fields" });
    }  
    
    // Check if the username already exists
    const usernameExists = await new Promise((resolve, reject) => {
      const checkQuery = 'SELECT COUNT(*) as count FROM users WHERE username = ?';
      conn.query(checkQuery, [username], (err, result) => {
        if (err) reject(err);
        resolve(result && result[0] && result[0].count > 0);
      });
    }).catch(error => {
      console.error('Promise rejected:', error);
      throw error;
    });
  
    if (usernameExists) {
      return res.status(400).json({ Error: "Username already exists" });
    }
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Set the role based on the status
    let role = 'Exam-taker'; // Default role
    if (status === 'admin') {
      role = 'Admin'; // If status is admin
    }
    if (status === 'alumni') {
      role = 'Exam-taker'; // If status is admin
    }
  
    // Insert user into the database
    const insertQuery = 'INSERT INTO users (name, username, password, role, status) VALUES (?, ?, ?, ?, ?)';
    const values = [name, username, hashedPassword, role, status];
    
    conn.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error("Error inserting user:", err);
        return res.status(500).json({ Error: "Failed to insert user" });
      }
      return res.json({ Status: "Success" });
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ Error: "Registration process failed" });
  }
});


app.post("/login", (req, res) => {
  const sql = "SELECT * FROM users WHERE username = ?";
  conn.query(sql, [req.body.username], (err, data) => {
    if (err) {
      return res.json({ Error: "Login error in server" });
    }
    if (data.length > 0) {
      bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
        if (err) {
          return res.json({ Error: "Password compare error" });
        }
        if (response) {
          const name = data[0].name;
          let role = data[0].role; // Get the role from the database
          const status = data[0].status; // Get the status from the database
          const user_id = data[0].user_id;

          // Check if the status is "student" or "alumni" and set the role accordingly
          if (status === "student" || status === "alumni") {
            role = "Exam-taker";
          }

          const token = jwt.sign({ user_id, name, role }, "jwt-secret-key", {
            expiresIn: "1d",
          });
          res.cookie("token", token);
          return res.json({ Status: "Login Successful", user_id, role });
        } else {
          return res.json({ Error: "Password error!" });
        }
      });
    } else {
      return res.json({ Error: "Invalid username or password!" });
    }
  });
});


app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "Success" });
});

app.post("/upload", async (req, res) => {
  try {
    const db = new Database();
    const conn = db.connection;

    const { Name } = req.body;

    const query = "INSERT INTO customer_insured (Name) VALUES (?)";
    const values = [Name];

    await conn.connect((err) => {
      if (err) throw err;
      conn.query(query, values, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.json({ data: "Customer added to the database" });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to upload customer" });
  }
});

app.get("/searchEntry/:name", async (req, res) => {
  const { name } = req.params;
  const db = new Database();
  const conn = db.connection;
  const query = "SELECT * FROM customer_entry WHERE Name LIKE ?";

  try {
    await conn.connect();

    conn.query(query, [`%${name}%`], (error, rows) => {
      if (error) throw error;
      res.json(rows);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/searchInsured/:name", async (req, res) => {
  const { name } = req.params;
  const db = new Database();
  const conn = db.connection;
  const query = "SELECT * FROM customer_insured WHERE Name LIKE ?";

  try {
    await conn.connect();

    conn.query(query, [`%${name}%`], (error, rows) => {
      if (error) throw error;
      res.json(rows);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(3001, function () {
  const db = new Database();
  db.TestConnection();
  console.log("Server is up and running at http://localhost:3001");
});
