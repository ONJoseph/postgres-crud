const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Configure the database connection
const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'postgres_cruddb',
  password: '****',
  port: '5432',
});

app.use(express.json());

// Create a new record (C - Create)
app.post('/create', async (req, res) => {
  try {
    const { name, email } = req.body;
    const query = 'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *';
    const values = [name, email];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Read all records (R - Read)
app.get('/read', async (req, res) => {
  try {
    const query = 'SELECT * FROM users';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Update a record (U - Update)
app.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const query = 'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *';
    const values = [name, email, id];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Delete a record (D - Delete)
app.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    const values = [id];
    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


// psql -U postgres
// CREATE DATABASE postgres_cruddb;
// \c postgres_cruddb;
// DROP TABLE IF EXISTS users;
// CREATE TABLE users (
// id SERIAL PRIMARY KEY,
// name VARCHAR(255) NOT NULL,
// email VARCHAR(255) NOT NULL
// );

/*
Test the CRUD Operations:
- To create a new record: curl -X POST -H "Content-Type: application/json" -d '{"name": "John Doe", "email": "johndoe@example.com"}' http://localhost:3000/create
- To read all records: curl http://localhost:3000/read
- To update a record: curl -X PUT -H "Content-Type: application/json" -d '{"name": "Updated Name", "email": "updated@example.com"}' http://localhost:3000/update/1
- To delete a record: curl -X DELETE http://localhost:3000/delete/1

The above code is a Node.js application using the Express.js framework for building a RESTful API that performs CRUD (Create, Read, Update, Delete) operations on a PostgreSQL database. Let's break down the code step by step:

Import Required Modules:
const express = require('express');
const { Pool } = require('pg');
express: This module allows you to create a web application and define API endpoints.
{ Pool }: This is part of the pg module, which is a PostgreSQL client for Node.js. It provides a connection pool for managing database connections efficiently.

Create an Express Application and Define the Port:
const app = express();
const port = process.env.PORT || 3000;
An Express application is created, and the server port is defined. The port is either taken from the environment variable PORT or defaults to 3000 if not provided.

Configure the Database Connection Using pg.Pool:
const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'postgres_cruddb',
  password: '2023',
  port: '5432',
});
A PostgreSQL connection pool is created using the provided database connection parameters. This pool manages and reuses database connections.

Middleware Setup for Parsing JSON Data:
app.use(express.json());
Express middleware is used to parse incoming JSON data in the request body.

Define API Endpoints for CRUD Operations:
Create a New Record (C - Create):
app.post('/create', async (req, res) => { ... });
This endpoint handles HTTP POST requests to create a new record in the database. It expects a JSON request body with name and email properties.

Read All Records (R - Read):
app.get('/read', async (req, res) => { ... });
This endpoint handles HTTP GET requests to retrieve all records from the database.

Update a Record (U - Update):
app.put('/update/:id', async (req, res) => { ... });
This endpoint handles HTTP PUT requests to update a specific record in the database. It expects the id of the record to be updated as a URL parameter and a JSON request body with name and email properties.

Delete a Record (D - Delete):
app.delete('/delete/:id', async (req, res) => { ... });
This endpoint handles HTTP DELETE requests to delete a specific record from the database. It expects the id of the record to be deleted as a URL parameter.
Implement CRUD Operations Using pool.query:

Inside each route handler (e.g., /create, /read, /update/:id, /delete/:id), database operations are performed using the pool.query method.
SQL queries are defined as strings, and parameters are passed as an array.
The await keyword is used to asynchronously execute the database query and retrieve results.
Successful responses are sent as JSON, and errors are handled with status code 500 (Internal Server Error).

Start the Express Server:
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
The Express server is started and listens on the defined port (either from the environment or port 3000 by default).
This code sets up a basic RESTful API for performing CRUD operations on a PostgreSQL database. You can use tools like curl or Postman to interact with the API by making HTTP requests to the specified endpoints.
*/