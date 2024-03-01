// Import necessary modules
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Import custom middleware and database functions
const { isAuth, isAdmin } = require("./middlewares");
const {
  initializeDatabase,
  initializeAdminUser,
  connection,
} = require("./database");

// Initialize the database
initializeDatabase();

// Add an admin user with username 'admin' and password 'admin'
initializeAdminUser();

// Create an Express app
const app = express();

// Use middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Authenticated route
app.get("/hello-world", isAuth, (req, res) => {
  return res.status(200).json({ content: "Hello World" });
});

// Admin-only route
app.get("/admin-only", [isAuth, isAdmin], (req, res) => {
  return res.status(200).json({ content: "This is for admin only!!!" });
});

// Register route
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Check if the user already exists
  connection.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, results) => {
      if (err) {
        console.error("Error checking user:", err);
        return res.status(500).json({ message: "Error checking user" });
      }

      if (results.length > 0) {
        return res.status(409).json({ message: "User already exists" });
      }

      // Hash the password and create a new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { username, password: hashedPassword };

      connection.query("INSERT INTO users SET ?", newUser, (err, result) => {
        if (err) {
          console.error("Error registering user:", err);
          return res.status(500).json({ message: "Error registering user" });
        }

        // Assign the USER_ROLE to the newly registered user
        const userId = result.insertId;
        const userRoleQuery =
          "INSERT INTO user_roles (user_id, role_id) SELECT ?, id FROM roles WHERE name = ?";

        connection.query(
          userRoleQuery,
          [userId, "USER_ROLE"],
          (err, result) => {
            if (err) {
              console.error("Error assigning role to user:", err);
              return res
                .status(500)
                .json({ message: "Error assigning role to user" });
            }
            console.log("User registered with USER_ROLE:", userId);
            res
              .status(201)
              .json({ message: "User registered successfully", userId });
          }
        );
      });
    }
  );
});

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Query to get the user and their role
  const userQuery = `
      SELECT users.*, roles.name AS role 
      FROM users 
      INNER JOIN user_roles ON users.id = user_roles.user_id 
      INNER JOIN roles ON user_roles.role_id = roles.id 
      WHERE users.username = ?
    `;

  connection.query(userQuery, [username], async (err, results) => {
    if (err) {
      console.error("Error logging in:", err);
      return res.status(500).json({ message: "Error logging in" });
    }

    if (results.length > 0) {
      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      console.log(user); // Check if the user object contains the role
      if (passwordMatch) {
        // Generate a JWT token
        const token = jwt.sign(
          { id: user.id, username: user.username, role: user.role },
          process.env.SECRET_KEY,
          { expiresIn: "1h" }
        );
        res.json({ token });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
});

// Start the server
app.listen(process.env.PORT, () => {
  console.log(
    `Express server listening at http://localhost:${process.env.PORT}`
  );
});
