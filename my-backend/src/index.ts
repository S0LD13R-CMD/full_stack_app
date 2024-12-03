import express from 'express';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

// Sample route to test the server
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Example route to fetch data from PostgreSQL
app.get('/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM my_table'); // Replace `my_table` with your table name
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching data');
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});