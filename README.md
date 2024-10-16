<!-- Running the Application
Development Environment
Start PostgreSQL with Docker Compose

bash
Copy code
npm run docker:dev
This starts the PostgreSQL container as per docker-compose.dev.yml.
Run Nest.js Locally

In a new terminal window, run:

bash
Copy code
npm run start:dev
The application will read from .env.development.
Nest.js will connect to PostgreSQL running in Docker.
Production Environment
Build and Run with Docker Compose

bash
Copy code
npm run docker:prod
This builds the Docker image and starts both app and db services.
The application will read from .env.production.

query from db

docker exec -it 7f9e0d87dfe0 psql -U postgres

\c blockchain_tracker_dev

SELECT * FROM price ORDER BY "createdAt" DESC; -->


# Blockchain Price Tracker

This is a blockchain price tracking service that provides real-time cryptocurrency price tracking for Ethereum (ETH) and Polygon (MATIC). The service also allows users to set price alerts and calculate swap rates between ETH/MATIC and Bitcoin (BTC).

## Features
- Fetch latest prices for Ethereum and Polygon.
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

---

## Running the Application

### Development Environment

1. **Start PostgreSQL with Docker Compose:**

   Use the following command to start a PostgreSQL container for development:

   ```bash
   npm run docker:dev
This command will start the PostgreSQL container as per docker-compose.dev.yml.

Run Nest.js Locally:

In a new terminal window, run the following command:

bash
Copy code
npm run start:dev
The application will read from .env.development, and Nest.js will connect to PostgreSQL running in Docker.

DEV IN DOCKER
docker-compose -f docker-compose.dev-app.yml up --build

Production Environment
Build and Run with Docker Compose:

Use the following command to build and run the application in production mode:

bash
Copy code
docker-compose -f docker-compose.prod.yml up --build
This command builds the Docker image and starts both app and db services. The application will read from .env.production.

Querying the Database
To access the database running in Docker, use the following commands:

Connect to the PostgreSQL container:

bash
Copy code
docker exec -it <container_id> psql -U postgres
Switch to the desired database:

bash
Copy code
\c blockchain_tracker_dev
Run a query to fetch prices:

sql
Copy code
SELECT * FROM price ORDER BY "createdAt" DESC;
API Endpoints
GET /price/latest
Fetches the latest prices for Ethereum and Polygon.

Example Response:
json
Copy code
{
  "ethereum": 2592.14,
  "polygon": 0.3696
}
GET /price/hourly/
Fetches hourly prices for the last 24 hours for a specific chain (either ethereum or polygon).

Example:
bash
Copy code
GET /price/hourly/ethereum
POST /price/set-alert
Sets a price alert for a specific chain (Ethereum or Polygon) and target price.

Example Request Body:
json
Copy code
{
  "chain": "polygon",
  "targetPrice": 0.368,
  "email": "example@domain.com"
}
POST /price/swap-rate
Calculates how much BTC can be received by swapping a given amount of ETH or MATIC, with a 0.03% fee.

Example Request Body:
json
Copy code
{
  "chain": "ethereum", 
  "amount": 1
}
Example Response:
json
Copy code
{
  "equivalentBTC": 0.03876251064548407,
  "fee": {
    "inChain": 0.03,
    "inDollar": 77.56
  }
}
Swagger Documentation
The Swagger UI can be accessed via the following URL to easily test the available APIs:

bash
Copy code
http://localhost:3000/api
Swagger provides an interactive API testing environment where you can send requests directly from your browser and view responses.

License
This project is licensed under the MIT License.

arduino
Copy code

This README provides clear instructions on running the applic