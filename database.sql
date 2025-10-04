-- Drop the table if it already exists to ensure a clean setup
DROP TABLE IF EXISTS reservations;

-- Create the reservations table for PostgreSQL
CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    number_of_guests INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

