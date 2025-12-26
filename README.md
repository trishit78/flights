# Flight Booking System

A comprehensive microservices-based application for booking flights, managing users, and sending notifications. This system is built using **Node.js**, **Express**, **TypeScript**, and **Prisma**, with communication handled via an **API Gateway** and **Redis** message queues.

## 🏗️ Architecture

The project consists of four distinct microservices:

1.  **[API Gateway](./api%20gateway)** (`Port: 5000`)
    *   Entry point for all client requests.
    *   Handles User Authentication & Authorization.
    *   Proxies requests to downstream services.
2.  **[Flights Service](./flights%20service)** (`Port: 3000`)
    *   Manages inventory: Flights, Airplanes, Airports, and Cities.
3.  **[Flights Booking Service](./flights%20booking%20service)** (`Port: 4000`)
    *   Handles ticket booking and payments.
    *   Consumes flight inventory and publishes notification events.
4.  **[Notification Service](./notification%20service)** (`Port: 8000`)
    *   Worker service that consumes email tasks from a Redis queue.

---

## 🚀 Getting Started

To run the entire system, you need to start each service individually. Ensure you have **MySQL** and **Redis** running locally.

### Prerequisites
*   Node.js (v18+)
*   Express.js
*   MySQL
*   Redis


### Installation
Clone the repository and install dependencies for each service:

```bash
# Gateway
cd "api gateway" && npm install

# Flights Service
cd "flights service" && npm install

# Booking Service
cd "flights booking service" && npm install

# Notification Service
cd "notification service" && npm install
```

### Running the Services
Open 4 separate terminals and run:

1.  **Terminal 1 (Flights Service):** `cd "flights service" && npm run dev`
2.  **Terminal 2 (Booking Service):** `cd "flights booking service" && npm run dev`
3.  **Terminal 3 (Notification Service):** `cd "notification service" && npm run dev`
4.  **Terminal 4 (API Gateway):** `cd "api gateway" && npm run dev`

---

## 🛠️ Combined API Quick Reference (Gateway)

All requests should be sent to `http://localhost:5000`.

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| **User Management** | | | |
| `POST` | `/api/v1/signup` | Register a new user | ❌ |
| `POST` | `/api/v1/signin` | Login and receive JWT | ❌ |
| `POST` | `/api/v1/role` | Add admin role (Admin only) | ✅ |
| **Flights (Proxy)** | | | |
| `GET` | `/flightsService/api/v1/flight` | Search flights | ❌ |
| `POST` | `/flightsService/api/v1/flight` | Create flight | ✅ (Should be Admin) |
| **Bookings (Proxy)** | | | |
| `POST` | `/bookingService/api/v1/booking` | Create a booking | ✅ |
| `POST` | `/bookingService/api/v1/booking/payment` | Create a payment | ✅ |

See individual service READMEs for detailed environment variables and API contracts.
