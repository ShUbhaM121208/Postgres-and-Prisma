const express = require("express");
const jwt = require("jsonwebtoken");

const jwtPassword = "123456";
const app = express();
app.use(express.json());

const ALL_USERS = [
  { username: "harkirat@gmail.com", password: "123", name: "Harkirat Singh" },
  { username: "raman@gmail.com", password: "123321", name: "Raman Singh" },
  { username: "priya@gmail.com", password: "123321", name: "Priya Kumari" },
];

// Function to check if user exists
function userExists(username, password) {
  return ALL_USERS.some(user => user.username === username && user.password === password);
}

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ msg: "Token required" });
  }

  try {
    const decoded = jwt.verify(token, jwtPassword);
    req.user = decoded; // Attach decoded user to request
    next();
  } catch (err) {
    return res.status(403).json({ msg: "Invalid token" });
  }
}

// Sign-in route
app.post("/signin", (req, res) => {
  const { username, password } = req.body;

  if (!userExists(username, password)) {
    return res.status(403).json({ msg: "User doesn't exist in our in-memory DB" });
  }

  const token = jwt.sign({ username }, jwtPassword, { expiresIn: "1h" });

  return res.json({ token });
});

// Get list of users (excluding the logged-in user)
app.get("/users", authenticateToken, (req, res) => {
  const username = req.user.username;
  const otherUsers = ALL_USERS.filter(user => user.username !== username);

  return res.json({ users: otherUsers });
});

// Start server
app.listen(3000, () => console.log("Server running on port 3000"));
