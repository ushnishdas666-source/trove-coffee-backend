// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Use the pg library for PostgreSQL

const app = express();
// Render will set the PORT environment variable; for local, it will use 3000
const port = process.env.PORT || 3000; 

app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION SETUP for RENDER ---
// This uses the DATABASE_URL that Render provides automatically
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, 
  // This is required for connecting to Render's database
  ssl: {
    rejectUnauthorized: false
  }
});
// --- END OF DATABASE CONNECTION SETUP ---


app.get('/', (req, res) => {
    res.send('Welcome to the Trove Coffee Backend API! The server is running.');
});

app.post('/reservations', async (req, res) => {
    console.log('\nReceived POST /reservations request.');
    const reservation = req.body;
    console.log('Data:', reservation);

    // SQL query for PostgreSQL uses $1, $2, etc. as placeholders
    const sql = 'INSERT INTO reservations (full_name, phone_number, reservation_date, reservation_time, number_of_guests) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    
    const guests = parseInt(reservation.guests) || 0;

    const values = [
        reservation.name,
        reservation.phone,
        reservation.date,
        reservation.time,
        guests
    ];

    try {
        const result = await pool.query(sql, values);
        console.log('Reservation saved successfully!', result.rows[0]);
        res.status(200).json({ success: true, message: 'Reservation confirmed!' });
    } catch (err) {
        console.error('--- DATABASE QUERY FAILED ---');
        console.error(err); 
        res.status(500).json({ success: false, message: 'Failed to save reservation.' });
    }
});

app.listen(port, () => {
    console.log(`>>> Trove Coffee Server has started successfully on port ${port} <<<`);
});
