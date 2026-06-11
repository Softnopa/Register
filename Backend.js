const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

const SECRET_KEY = "secret";

let users = [
    {
        username: "admin",
        password: "1234"
    }
];

let todos = [];

app.get("/", (req, res) => {
    res.send("Backend is working");
});

app.post("/api/auth/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: "Fill all fields"
        });
    }

    const userExists = users.find(user => user.username === username);

    if (userExists) {
        return res.status(400).json({
            message: "User already exists"
        });
    }

    users.push({
        username: username,
        password: password
    });

    res.json({
        message: "Register success"
    });
});

app.post("/api/auth/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        const token = jwt.sign({ username: username }, SECRET_KEY);

        res.json({
            token: token
        });
    } else {
        res.status(400).json({
            message: "Login failed"
        });
    }
});

function auth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Token not found"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const user = jwt.verify(token, SECRET_KEY);
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({
            message: "Invalid token"
        });
    }
}

app.get("/api/todos", auth, (req, res) => {
    const userTodos = todos.filter(todo => todo.username === req.user.username);

    res.json(userTodos);
});

app.post("/api/todos", auth, (req, res) => {
    const title = req.body.title;

    if (!title) {
        return res.status(400).json({
            message: "Title is required"
        });
    }

    const newTodo = {
        id: Date.now(),
        title: title,
        username: req.user.username
    };

    todos.push(newTodo);

    res.json(newTodo);
});

if (require.main === module) {
    app.listen(5000, () => {
        console.log("Server started on port 5000");
    });
}

module.exports = app;