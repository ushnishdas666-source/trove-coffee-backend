-- This line safely deletes the table only if it already exists.
DROP TABLE IF EXISTS reservations;

-- This is the same command as before to create the table with the correct structure.
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    number_of_guests INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
