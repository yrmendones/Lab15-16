const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MySQL database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "SchoolDB"
});

db.connect(err => {
    if (err) {
        console.error("❌ Database connection failed: " + err.stack);
        process.exit(1);
    }
    console.log("✅ Connected to MySQL database.");
});

// Test route
app.get("/", (req, res) => {
    res.send("🎉 API is running...");
});

// Add student route
app.post("/add", (req, res) => {
    const { name, math, science, english } = req.body;

    if (!name || math == null || science == null || english == null) {
        return res.status(400).json({ error: "All fields (name, math, science, english) are required." });
    }

    const average = parseFloat(((math + science + english) / 3).toFixed(2));
    const grade = average >= 90 ? "A" :
                  average >= 80 ? "B" :
                  average >= 70 ? "C" : "D";

    const sql = "INSERT INTO Students (name, math, science, english, average, grade) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [name, math, science, english, average, grade], (err, result) => {
        if (err) {
            console.error("❌ Failed to insert student:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: "✅ Student added successfully!" });
    });
});

// Get all students route (for viewing the list later)
app.get("/students", (req, res) => {
    const sql = "SELECT * FROM Students";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Failed to fetch students:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});