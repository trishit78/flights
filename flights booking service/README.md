# Flights Booking Service

The **Booking Service** handles the reservation logic. It consumes flight data, manages booking states (Initiated, Booked, Cancelled), and publishes events for email notifications.

## ⚙️ Configuration (.env)

Create a `.env` file in this directory:

```env
PORT=4000
# Database Connection (MySQL)
DATABASE_URL="mysql://root:password@localhost:3306/flights_dev"

# Service Discovery
FLIGHT_SERVICE="http://localhost:3000"
API_GATEWAY="http://localhost:5000"

# Redis (Message Queue)
REDIS_PORT=6379
REDIS_HOST="localhost"

# Security (Matches API Gateway)
JWT_SECRET="anything" 
```

## 📡 API Endpoints

**Base URL:** `/api/v1`

### 📅 Bookings
*   `POST /booking`
    *   **Description:** Initiates a booking. Reserves seats temporarily.
    *   **Body:** `{ "flightId": 1, "noOfSeats": 2 }`
    *   **Auth:** Requires Bearer Token.

*   `POST /booking/payments`
    *   **Description:** Confirms payment and finalizes the booking.
    *   **Body:** `{ "bookingId": 123, "totalCost": 5000 }`
    *   **Auth:** Requires Bearer Token.

## 🔄 Cron Jobs & Workers
*   **Cron Job:** Automatically cancels "Old Bookings" (INITIATED but not paid within 10-15 mins) and releases the seats back to the Flight Service.
*   **Queue Producer:** Pushes email notification tasks to the `mailerQueue` upon successful booking.