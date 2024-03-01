// Import required modules
const jwt = require("jsonwebtoken"); // Module to handle JSON Web Tokens
const { connection } = require("./database"); // Import the database connection from the database module

/**
 * Middleware to check if the request is authenticated
 */
const isAuth = (req, res, next) => {
  const authHeader = req.headers.authorization; // Retrieve the Authorization header from the request

  // Check if the Authorization header is present and correctly formatted
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" }); // If not, return an Unauthorized error
  }

  const token = authHeader.split(" ")[1]; // Extract the token from the Authorization header

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // Attach the decoded token to the request object
    next(); // Call the next middleware function
  } catch (error) {
    // If token verification fails, return an Unauthorized error
    res.status(401).json({ message: "Unauthorized" });
  }
};

/**
 * Middleware to check if the authenticated user is an admin
 */
const isAdmin = (req, res, next) => {
  const userId = req.user.id; // Retrieve the user ID from the request object

  // Query the database to check the user's roles
  connection.query(
    "SELECT * FROM user_roles INNER JOIN roles ON user_roles.role_id = roles.id WHERE user_roles.user_id = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.error("Error checking user role:", err);
        return res.status(500).json({ message: "Error checking user role" });
      }

      // Check if any of the user's roles is the admin role
      const isAdminRole = results.some((role) => role.name === "ADMIN_ROLE");

      if (isAdminRole) {
        next(); // If the user is an admin, call the next middleware function
      } else {
        // If the user is not an admin, return a Forbidden error
        res.status(403).json({ message: "Forbidden: Requires admin role" });
      }
    }
  );
};

// Export the authentication and authorization middleware functions
module.exports = { isAuth, isAdmin };
