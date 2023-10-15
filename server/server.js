const express = require("express");
const Database = require("./src/configs/Database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const salt = 5;
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');

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
const verifyRouter = require ("./src/routes/Verification")

app.use("/exams", examsRouter);
app.use("/questions", questionsRouter); // Add this
app.use("/choices", choicesRouter); // Add this
app.use("/category", programRouter); // Add this
app.use("/filter", filterRouter); // Add this
app.use("/verify", verifyRouter); // Add this

app.use(cookieParser());

const db = new Database();
const conn = db.connection;

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'avatar'); // Save images in the 'avatar' folder within the 'server' folder
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname); // Use the original filename as the stored filename
  },
});

const upload = multer({ storage: storage });

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Replace with your email service provider
  auth: {
    user: 'zoren.panilagao1@gmail.com', // Replace with your email
    pass: 'yvij frwd swws udms', // Replace with your email password
  },
});

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

app.post('/register', upload.single('profileImage'), async (req, res) => {
  const { name, username, password, gender, status } = req.body;
  let imagePath = ''; // Initialize imagePath as null
  const serverFolderPath = 'server/';


  if (req.file) {
    // Image has been uploaded
    imagePath = serverFolderPath + 'avatar/' + req.file.originalname; // Path to the uploaded image
  }

  try {
    // Validate incoming data
    if (!name || !username || !password || !gender || !status) {
      return res.status(400).json({ Error: "Missing required fields" });
    }

    // Check if the username already exists
    const usernameExists = await new Promise((resolve, reject) => {
      const checkQuery = 'SELECT COUNT(*) as count FROM users WHERE username = ?';
      conn.query(checkQuery, [username], (err, result) => {
        if (err) reject(err);
        resolve(result && result[0] && result[0].count > 0);
      });
    }).catch((error) => {
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
      role = 'Exam-taker'; // If status is alumni
    }

    // Insert user into the database, including the imagePath
    const insertQuery =
      'INSERT INTO users (name, username, password, gender, role, status, image) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [name, username, hashedPassword, gender, role, status, imagePath];

    conn.query(insertQuery, values, (err, result) => {
      if (err) {
        console.error("Error inserting user:", err);
        return res.status(500).json({ Error: "Failed to insert user" });
      }

      // Send an email to the Super Admin for verification
      transporter.sendMail({
        from: 'zoren.panilagao1@gmail.com', // Replace with your email
        to: 'zoren.panilagao7@gmail.com', // Replace with the Super Admin's email
        subject: 'New Exam-taker Registration',
        text: 'A new Exam-taker has registered and requires verification.',
      });

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

          // Here, you can check the verification status from the database
          const isVerified = data[0].isVerified; // Assuming you have an "isVerified" column

          // Include the isVerified status in the token payload
          const token = jwt.sign({ user_id, name, role, isVerified }, "jwt-secret-key", {
            expiresIn: "1d",
          });
          res.cookie("token", token);

          return res.json({ Status: "Login Successful", user_id, role, isVerified });
        } else {
          return res.json({ Error: "Password error!" });
        }
      });
    } else {
      return res.json({ Error: "Invalid username or password!" });
    }
  });
});





app.listen(3001, function () {
  const db = new Database();
  db.TestConnection();
  console.log("Server is up and running at http://localhost:3001");
});
