# React-ExpressJS Authentication Project

This is the backend server for a React-Express authentication project. It provides APIs for user registration, login, and role-based access control.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or later)
- [MySQL](https://www.mysql.com/) or a compatible database server

## Installation

1. Clone the repository or download the source code.
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. 
```bash 
    npm install
```

## Configuration
change the .env variables with your credentials
DB_HOST=localhost
DB_USER=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=auth
JWT_SECRET=your_jwt_secret

## Running the Server
```bash
npm run dev
```

## Database Initialization
The server will automatically initialize the database structure and create an admin user (username: admin, password: admin) when it starts.

## API Endpoints

    POST /register: Register a new user
    POST /login: Log in an existing user
    GET /hello-world : For authenticated users
    GET /admin-only: For authenticated admin users
