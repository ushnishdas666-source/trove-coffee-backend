// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); 
const sgMail = require('@sendgrid/mail'); // Import SendGrid

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- SET SENDGRID API KEY ---
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.post('/reservations', async (req, res) => {
    const reservation = req.body;
    const { name, phone, date, time, guests } = reservation;

    const sql = 'INSERT INTO reservations (full_name, phone_number, reservation_date, reservation_time, number_of_guests) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [name, phone, date, time, parseInt(guests) || 0];

    try {
        const result = await pool.query(sql, values);
        console.log('Reservation saved successfully!', result.rows[0]);

        // --- SEND EMAIL NOTIFICATION ---
        const msg = {
          to: 'dasjayashree549@gmail.com', // <-- CRITICAL: Change this to the owner's email
          from: 'ushnishdas666@gmail.com', // <-- CRITICAL: Change this to your verified SendGrid sender email
          subject: `New Reservation from ${name}`,
          html: `
            <h2>New Table Reservation</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Guests:</strong> ${guests}</p>
          `,
        };

        await sgMail.send(msg);
        console.log('Notification email sent successfully.');
        // --- END OF EMAIL NOTIFICATION ---

        res.status(200).json({ success: true, message: 'Reservation confirmed!' });

    } catch (err) {
        console.error('--- ACTION FAILED ---');
        console.error(err); 
        res.status(500).json({ success: false, message: 'Failed to process reservation.' });
    }
});

app.listen(port, () => {
    console.log(`>>> Trove Coffee Server has started successfully on port ${port} <<<`);
});
