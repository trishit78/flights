# API Gateway

The **API Gateway** acts as the single entry point for the Flight Booking System. It handles request routing, authentication, and rate limiting.

## ⚙️ Configuration (.env)

Create a `.env` file in the root of this directory:

```env
PORT=5000
JWT_SECRET=anything           # Secret for signing JWT tokens
JWT_EXPIRY=1d                # Token expiry duration
FLIGHT_SERVICE=http://localhost:3000   # URL of Flights Service
BOOKING_SERVICE=http://localhost:4000  # URL of Booking Service
```

## 🔐 Authentication Flow
*   **Sign Up/Sign In:** Users request `/api/v1/signup` and `/signin` to get a JWT.
*   **Protected Routes:** Requests to `/bookingService` require a valid `Authorization: Bearer <token>` header.
*   **Middleware:** The gateway verifies the token using `JWT_SECRET` before proxying the request.

## 📡 API Endpoints

### User Management
*   **Base URL:** `/api/v1`

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/signup` | Register a new user (`email`, `password`, `name`) | ❌ |
| `POST` | `/signin` | Login (`email`, `password`) → Returns JWT | ❌ |
| `GET` | `/:id` | Get user details by ID | ❌ |
| `POST` | `/role` | Add 'ADMIN' role to user | ✅ (Admin only) |

### Proxied Routes (Microservices)

#### Flights Service Proxy
*   **Prefix:** `/flightsService`
*   **Target:** `http://localhost:3000`
*   **Example:** `GET /flightsService/api/v1/city` is proxied to `GET http://localhost:3000/api/v1/city`

#### Booking Service Proxy
*   **Prefix:** `/bookingService`
*   **Target:** `http://localhost:4000`
*   **Auth:** Requires valid Bearer Token.
*   **Example:** `POST /bookingService/api/v1/booking` is proxied to `http://localhost:4000/api/v1/booking`
