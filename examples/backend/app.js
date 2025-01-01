const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 5000;

// Connect to MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'mydb'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

app.get('/', (req, res) => {
  res.send('Hello from the Backend!');
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});

