------------------------------------------------------------
-- CSE 340 - Rebuild Script
-- Author: Edwin Kambale
-- Purpose: Completely rebuilds database tables and sample data
------------------------------------------------------------

------------------------------------------------------------
-- 1. DROP TABLES IN CORRECT ORDER
------------------------------------------------------------
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS classification;

------------------------------------------------------------
-- 2. CREATE TABLES
------------------------------------------------------------

-- classification table
CREATE TABLE classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(50) NOT NULL UNIQUE
);

-- inventory table
CREATE TABLE inventory (
    inventory_id SERIAL PRIMARY KEY,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    description TEXT,
    image VARCHAR(200),
    thumbnail VARCHAR(200),
    price NUMERIC(10,2) NOT NULL,
    year INT NOT NULL,
    miles INT,
    color VARCHAR(30),
    classification_id INT NOT NULL,
    FOREIGN KEY (classification_id)
        REFERENCES classification(classification_id)
        ON DELETE CASCADE
);

-- clients table
CREATE TABLE clients (
    client_id SERIAL PRIMARY KEY,
    client_firstname VARCHAR(50) NOT NULL,
    client_lastname VARCHAR(50) NOT NULL,
    client_email VARCHAR(100) NOT NULL UNIQUE,
    client_type VARCHAR(20) DEFAULT 'Client'
);

-- notes table
CREATE TABLE notes (
    note_id SERIAL PRIMARY KEY,
    note_details TEXT NOT NULL,
    client_id INT NOT NULL,
    note_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id)
        REFERENCES clients(client_id)
        ON DELETE CASCADE
);

------------------------------------------------------------
-- 3. INSERT SAMPLE DATA
------------------------------------------------------------

-- sample classification
INSERT INTO classification (classification_name)
VALUES ('SUV'), ('Truck'), ('Sedan');

-- sample inventory
INSERT INTO inventory 
(make, model, description, image, thumbnail, price, year, miles, color, classification_id)
VALUES
('Toyota', 'RAV4', 'Compact SUV', '/images/rav4.png', '/images/rav4-thumb.png', 25000, 2020, 30000, 'Silver', 1),
('Ford', 'F-150', 'Popular truck', '/images/f150.png', '/images/f150-thumb.png', 32000, 2019, 45000, 'Blue', 2);

-- sample clients
INSERT INTO clients (client_firstname, client_lastname, client_email, client_type)
VALUES
('John', 'Doe', 'john@example.com', 'Client'),
('Sarah', 'Brown', 'sarah@example.com', 'Admin');

-- sample notes
INSERT INTO notes (note_details, client_id)
VALUES
('Client requested a callback.', 1),
('Admin approved the vehicle listing.', 2);

------------------------------------------------------------
-- END
------------------------------------------------------------
