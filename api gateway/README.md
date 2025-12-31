# API Gateway

The **API Gateway** acts as the single entry point for the Flight Booking System. It handles request routing, authentication, and rate limiting.

## ⚙️ Configuration (.env)

Create a `.env` file in the root of this directory:

```env
PORT=5000
JWT_SECRET=anything           # Secret for signing JWT tokens
JWT_EXPIRY=1d                # Token expiry duration
FLIGHT_SERVICE=http://localhost:3500   # URL of Flights Service (Note: Port 3500)
BOOKING_SERVICE=http://localhost:4000  # URL of Booking Service
```

**Note**: The Flights Service runs on port **3500** (not 3000) to avoid conflicts with the frontend.

## 🔐 Authentication Flow
*   **Sign Up/Sign In:** Users request `/api/v1/signup` and `/api/v1/signin` to get a JWT.
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
*   **Target:** `http://localhost:3500` (Note: Port 3500)
*   **Auth:** Optional (depends on endpoint)
*   **Example:** `GET /flightsService/api/v1/city` is proxied to `GET http://localhost:3500/api/v1/city`

#### Booking Service Proxy
*   **Prefix:** `/bookingService`
*   **Target:** `http://localhost:4000`
*   **Auth:** Requires valid Bearer Token.
*   **Example:** `POST /bookingService/api/v1/booking` is proxied to `http://localhost:4000/api/v1/booking`

## 🏗️ Architecture

### Request Flow

```
Client Request
    ↓
API Gateway (Port 5000)
    ├──→ Authentication Check (if required)
    ├──→ Rate Limiting
    └──→ Route to Service
         ├──→ Flights Service (Port 3500)
         └──→ Booking Service (Port 4000)
```

### Database Schema

**Database**: `api_gateway_db`

**Tables:**
- `User` - User accounts with email and password
- `Role` - Available roles (ADMIN, CUSTOMER, FLIGHT_COMPANY)
- `User_Roles` - Junction table for user-role assignments

**Relationships:**
- `User` (1) → (Many) `User_Roles` → (Many) `Role`

See root [README.md](../README.md) for detailed database design.

## 🔧 Dependencies

### Core Dependencies
- `express` (v5.2.1) - Web framework
- `@prisma/client` (v7.2.0) - Database ORM
- `jsonwebtoken` (v9.0.3) - JWT token handling
- `bcryptjs` (v3.0.3) - Password hashing
- `http-proxy-middleware` (v3.0.5) - Request proxying
- `express-rate-limit` (v8.2.1) - Rate limiting
- `zod` (v4.2.1) - Schema validation
- `cors` (v2.8.5) - CORS middleware

### Development Dependencies
- `typescript` (v5.9.3)
- `tsx` (v4.21.0)
- `nodemon` (v3.1.11)
- `prisma` (v7.2.0)

## 🚀 Running the Service

### Development

```bash
npm install
npm run dev
```

The service will start on `http://localhost:5000`

### Production

```bash
npm install
npm run build
npm start
```

## 🔐 Security Features

- **JWT Authentication**: Token-based authentication for protected routes
- **Password Hashing**: bcryptjs for secure password storage
- **Rate Limiting**: Express rate limiter to prevent abuse
- **Input Validation**: Zod schemas for request validation
- **CORS**: Configurable CORS policies

## 📝 Notes

- The gateway uses **http-proxy-middleware** for service proxying
- JWT tokens are signed with `JWT_SECRET` and expire after `JWT_EXPIRY`
- Rate limiting is applied to prevent API abuse
- All user passwords are hashed using bcryptjs before storage
- Port **5000** is used for the gateway service
