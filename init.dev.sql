-- Create the database for development
CREATE DATABASE blockchain_tracker_dev;

-- Connect to the blockchain_tracker_dev database
\c blockchain_tracker_dev;

-- Create the 'price' table for storing cryptocurrency prices
CREATE TABLE IF NOT EXISTS price (
  id SERIAL PRIMARY KEY,
  chain VARCHAR(50) NOT NULL,  -- Chain (e.g., 'ethereum', 'polygon')
  price FLOAT NOT NULL,        -- Price in USD
  createdAt TIMESTAMP DEFAULT NOW()  -- Timestamp for when the price was fetched
);

-- Create the 'alert' table for storing price alerts
CREATE TABLE IF NOT EXISTS alert (
  id SERIAL PRIMARY KEY,
  chain VARCHAR(50) NOT NULL,  -- Chain (e.g., 'ethereum', 'polygon')
  targetPrice FLOAT NOT NULL,  -- Target price for the alert
  email VARCHAR(255) NOT NULL, -- User email to notify
  createdAt TIMESTAMP DEFAULT NOW()  -- Timestamp for when the alert was created
);
