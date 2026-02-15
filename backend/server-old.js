const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3000;
const JWT_SECRET = "super_secret_key_change_later";

app.use(cors());
app.use(express.json());

// In-memory storage (temporary)
const users = [];
const sessions = [];

/* ======================
   AUTH ROUTES
====================== */

// Signup
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    id: users.length + 1,
    email,
    password: hashedPassword
  };

  users.push(user);
  res.json({ message: "User created" });
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: "1h"
  });

  res.json({ token });
});

/* ======================
   AUTH MIDDLEWARE
====================== */

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "No token" });
  }

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

/* ======================
   STUDY SESSION ROUTES
====================== */

// Start session
app.post("/sessions/start", authenticate, (req, res) => {
  const session = {
    id: sessions.length + 1,
    userId: req.userId,
    startTime: new Date(),
    endTime: null,
    interruptions: 0,
    paused: false,
    active: true
  };

  sessions.push(session);
  res.json(session);
});

// Pause session (AI)
app.post("/sessions/pause", authenticate, (req, res) => {
  const session = sessions.find(
    s => s.userId === req.userId && s.active
  );

  if (!session) {
    return res.status(404).json({ message: "No active session" });
  }

  session.interruptions += 1;
  session.paused = true; // 👈 pause, not stop

  res.json({ message: "Session paused" });
});

// Stop session
app.post("/sessions/stop", authenticate, (req, res) => {
  const session = sessions.find(
    s => s.userId === req.userId && s.active
  );

  if (!session) {
    return res.status(404).json({ message: "No active session" });
  }

  session.endTime = new Date();
  session.active = false;

  res.json(session);
});

/* ======================
   SERVER START
====================== */

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
