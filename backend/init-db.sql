-- Create a table for users if it doesn't already exist
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY, 
  username VARCHAR(255) NOT NULL UNIQUE, -- The username of the user, must be unique
  password VARCHAR(255) NOT NULL        -- The password of the user
);

-- Create a table for roles if it doesn't already exist
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,  
  name VARCHAR(50) NOT NULL UNIQUE -- The name of the role, must be unique
);

-- Insert default roles into the roles table, ignoring duplicates
INSERT IGNORE INTO roles (name) VALUES 
  ('USER_ROLE'),    -- Standard user role
  ('ADMIN_ROLE');   -- Administrator role

-- Create a table for user_roles if it doesn't already exist
CREATE TABLE IF NOT EXISTS user_roles (
  user_id INT,      -- The ID of the user
  role_id INT,      -- The ID of the role
  PRIMARY KEY (user_id, role_id), -- Composite primary key to ensure unique user-role pairs
  FOREIGN KEY (user_id) REFERENCES users(id), -- Foreign key constraint to link to the users table
  FOREIGN KEY (role_id) REFERENCES roles(id)  -- Foreign key constraint to link to the roles table
);