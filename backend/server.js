const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Kalai@2006",
    database: "task_management"
});

db.connect(function(error) {

    if (error) {
        console.log("Database connection failed");
        console.log(error);
    } else {
        console.log("MySQL connected successfully");
    }

});

app.get("/", (req, res) => {

    res.send("Task Management Backend Running");

});

app.post("/register", (req, res) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [name, email, password], function(error, result) {

        if (error) {
            console.log(error);

            res.status(500).json({
                message: "Registration failed"
            });

            return;
        }

        res.json({
            message: "Registration successful"
        });

    });

});

app.post("/login", (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";

    db.query(sql, [email, password], function(error, result) {

        if (error) {
            console.log(error);

            res.status(500).json({
                message: "Login failed"
            });

            return;
        }

        if (result.length > 0) {

            res.json({
                message: "Login successful",
                user: result[0]
            });

        } else {

            res.status(401).json({
                message: "Invalid email or password"
            });

        }

    });

});

app.post("/tasks", (req, res) => {

    const title = req.body.title;
    const description = req.body.description;
    const due_date = req.body.due_date;
    const priority = req.body.priority;
    const user_id = req.body.user_id;

    const sql = "INSERT INTO tasks (title, description, due_date, priority, user_id) VALUES (?, ?, ?, ?, ?)";

    db.query(sql, [title, description, due_date, priority, user_id], function(error, result) {

        if (error) {
            console.log(error);

            res.status(500).json({
                message: "Task creation failed"
            });

            return;
        }

        res.json({
            message: "Task created successfully",
            id: result.insertId
        });

    });

});


app.get("/tasks/:user_id", (req, res) => {

    const user_id = req.params.user_id;

    const sql = "SELECT * FROM tasks WHERE user_id = ?";

    db.query(sql, [user_id], function(error, result) {

        if (error) {
            console.log(error);

            res.status(500).json({
                message: "Failed to get tasks"
            });

            return;
        }

        res.json(result);

    });

});


app.put("/tasks/:id", (req, res) => {

    const id = req.params.id;
    const status = req.body.status;

    const sql = "UPDATE tasks SET status = ? WHERE id = ?";

    db.query(sql, [status, id], function(error, result) {

        if (error) {
            console.log(error);

            res.status(500).json({
                message: "Task update failed"
            });

            return;
        }

        res.json({
            message: "Task completed successfully"
        });

    });

});


app.delete("/tasks/:id", (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM tasks WHERE id = ?";

    db.query(sql, [id], function(error, result) {

        if (error) {
            console.log(error);

            res.status(500).json({
                message: "Task deletion failed"
            });

            return;
        }

        res.json({
            message: "Task deleted successfully"
        });

    });

});


app.listen(5000, () => {

    console.log("Server running on port 5000");

});