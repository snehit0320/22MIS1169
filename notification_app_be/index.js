const express = require("express");
const Log = require("../logging_middleware");

const app = express();
app.use(express.json());

// Home route
app.get("/", async (req, res) => {
  await Log("backend", "info", "route", "Home route accessed");
  res.send("Server is running");
});

// Users route
app.get("/users", async (req, res) => {
  try {
    await Log("backend", "info", "controller", "Fetching users");
    const users = ["Snehan", "Alex", "John"];
    res.json(users);
  } catch (err) {
    await Log("backend", "error", "controller", "Error fetching users");
    res.status(500).send("Error");
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    await Log("backend", "warn", "handler", "Login without username");
    return res.status(400).send("Username required");
  }

  await Log("backend", "info", "service", `User ${username} logged in`);
  res.send("Login successful");
});

// Start server
app.listen(3000, async () => {
  console.log("Server running on port 3000");
  await Log("backend", "info", "config", "Server started");
});