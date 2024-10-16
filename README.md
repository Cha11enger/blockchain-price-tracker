# Blockchain Price Tracker

This is a blockchain price tracking service that provides real-time cryptocurrency price tracking for Ethereum (ETH) and Polygon (MATIC). The service also allows users to set price alerts and calculate swap rates between ETH/MATIC and Bitcoin (BTC).

## Features

- Fetch the latest prices for Ethereum and Polygon.
- Get hourly price data for the past 24 hours.
- Set up price alerts for Ethereum and Polygon.
- Calculate swap rates from ETH/MATIC to BTC with a 0.03% fee.
- Swagger documentation for easy API testing.

## Technologies

- **Nest.js**: Backend framework
- **PostgreSQL**: Database to store price data
- **Docker**: For containerized environments
- **Moralis API**: Used to fetch ETH and MATIC prices
- **Coingecko API**: Used to fetch Bitcoin prices

## Running the Application

### Development Environment

1. **Start PostgreSQL with Docker Compose:**

   Use the following command to start a PostgreSQL container for development:

   ```bash
   npm run docker:dev
This command will start the PostgreSQL container as per `docker-compose.dev.yml`.

**Run Nest.js Locally:**
In a new terminal window, run the following command:

     npm run start:dev

The application will read from `.env.development`, and Nest.js will connect to PostgreSQL running in Docker.

2.  **Run DEV in Docker:**
    
    `docker-compose -f docker-compose.dev-app.yml up --build` 
    

### Production Environment

1.  **Build and Run with Docker Compose:**
    
    Use the following command to build and run the application in production mode:
    
    `docker-compose -f docker-compose.prod.yml up --build` 
    
    This command builds the Docker image and starts both app and db services. The application will read from `.env.production`.

### Querying the Database

To access the database running in Docker, use the following commands:

1.  **Connect to the PostgreSQL container:**
    
    `docker exec -it <container_id> psql -U postgres` 
    
2.  **Switch to the desired database:**
    
    `\c blockchain_tracker_dev` 
    
3.  **Run a query to fetch prices:**
    
    sql
    
    `SELECT * FROM price ORDER BY "createdAt" DESC;` 
    

## API Endpoints

### GET `/price/latest`

Fetches the latest prices for Ethereum and Polygon.

**Example Response:**

json

    {
      "ethereum": 2592.14,
      "polygon": 0.3696
    } 

### GET `/price/hourly/:chain`

Fetches hourly prices for the last 24 hours for a specific chain (either `ethereum` or `polygon`).

**Example:**

`GET /price/hourly/ethereum` 

### POST `/price/set-alert`

Sets a price alert for a specific chain (Ethereum or Polygon) and target price.

**Example Request Body:**

json

    {
      "chain": "polygon",
      "targetPrice": 0.368,
      "email": "example@domain.com"
    } 

### POST `/price/swap-rate`

Calculates how much BTC can be received by swapping a given amount of ETH or MATIC, with a 0.03% fee.

**Example Request Body:**

json

    {
      "chain": "ethereum",
      "amount": 1
    } 

**Example Response:**

    {
      "equivalentBTC": 0.03876251064548407,
      "fee": {
        "inChain": 0.03,
        "inDollar": 77.56
      }
    } 

## Swagger Documentation

The Swagger UI can be accessed via the following URL to easily test the available APIs:

`http://localhost:3000/api` 

Swagger provides an interactive API testing environment where you can send requests directly from your browser and view responses.

## License

This project is licensed under the MIT License.

 `This Markdown file provides detailed instructions and information.`