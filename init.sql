-- Connect to the database, avoid creating it if it already exists
\c blockchain_tracker_prod;

-- Create the 'price' table if it does not exist
CREATE TABLE IF NOT EXISTS price (
  id SERIAL PRIMARY KEY,
  chain VARCHAR(50) NOT NULL,
  price FLOAT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Create the 'alert' table if it does not exist
CREATE TABLE IF NOT EXISTS alert (
  id SERIAL PRIMARY KEY,
  chain VARCHAR(50) NOT NULL,
  "targetPrice" FLOAT NOT NULL,
  email VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW()
);
