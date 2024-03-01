// Load required modules
const bcrypt = require("bcrypt"); // For hashing passwords
const mysql = require("mysql2"); // MySQL database driver
const fs = require("fs"); // File system module for reading files
const path = require("path"); // Path module for handling file paths

// Set up a connection to the MySQL database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true, // Enable execution of multiple SQL statements in one query
});

// Function to initialize the admin user in the database
async function initializeAdminUser() {
  const adminUsername = "admin"; // Admin username
  const adminPassword = "admin"; // Admin password (plaintext)
  const hashedPassword = await bcrypt.hash(adminPassword, 10); // Hash the admin password

  // SQL query to insert the admin user into the 'users' table, ignoring duplicates
  const adminUserQuery =
    "INSERT IGNORE INTO users (username, password) VALUES (?, ?)";
  connection.query(
    adminUserQuery,
    [adminUsername, hashedPassword], // Bind parameters to the query
    (err, result) => {
      if (err) {
        console.error("Error creating admin user:", err);
        return;
      }
      if (result.affectedRows > 0) {
        console.log("Admin user created");
        const adminUserId = result.insertId; // Get the ID of the newly created admin user

        // SQL query to assign the 'ADMIN_ROLE' to the admin user
        const adminRoleQuery =
          "INSERT INTO user_roles (user_id, role_id) SELECT ?, id FROM roles WHERE name = ?";
        connection.query(
          adminRoleQuery,
          [adminUserId, "ADMIN_ROLE"], // Bind parameters to the query
          (err, result) => {
            if (err) {
              console.error("Error assigning role to admin user:", err);
            }
            if (result.affectedRows > 0) {
              console.log("Admin role assigned to admin user");
            }
          }
        );
      }
    }
  );
}

// Function to initialize the database structure
const initializeDatabase = () => {
  connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL database!");

    // Read the SQL script file for initializing the database
    const initScript = fs.readFileSync(
      path.join(__dirname, "init-db.sql"),
      "utf8"
    );

    // Execute the SQL script to initialize the database structure
    connection.query(initScript, (err, results) => {
      if (err) throw err;

      // Log the successful execution of each SQL statement in the script
      console.log("Database structure initialized:");
      results.forEach((result, index) => {
        console.log(` - Statement ${index + 1}: Success`);
      });
    });
  });
};

// Export the database connection and initialization functions
module.exports = { connection, initializeAdminUser, initializeDatabase };
