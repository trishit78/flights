# API Documentation

This document references the APIs available across the `Flight Service`, `Booking Service`, and `API Gateway`.

## 1. Flight Service
**Base URL**: `http://localhost:<FLIGHT_SERVICE_PORT>/api/v1`

### Airplane APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/airplane/` | Create a new airplane. Requires validation. |
| `GET` | `/airplane/` | Get all airplanes. |
| `GET` | `/airplane/:id` | Get a specific airplane by ID. |
| `PUT` | `/airplane/` | Update an airplane. |
| `DELETE` | `/airplane/:id` | Delete an airplane by ID. |

### City APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/city/` | Create a new city. |
| `GET` | `/city/` | Get all cities. |
| `GET` | `/city/:id` | Get a specific city by ID. |
| `PUT` | `/city/:id` | Update a city by ID. |
| `DELETE` | `/city/:id` | Delete a city by ID. |

### Airport APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/airport/` | Create a new airport. |
| `GET` | `/airport/` | Get airport details. |
| `GET` | `/airport/:id` | Get all airports (Note: Naming convention in code suggests :id but handler is getAll). |
| `PUT` | `/airport/` | Update airport details. |
| `DELETE` | `/airport/:id` | Delete an airport by ID. |

### Flight APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/flight/` | Create a new flight. |
| `GET` | `/flight/` | Get all flights. |
| `GET` | `/flight/:id` | Get a specific flight by ID. |
| `PATCH` | `/flight/:id/seats` | Update flight seats. |

### Ping
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/ping/` | Health check route. |

---

## 2. Booking Service
**Base URL**: `http://localhost:<BOOKING_SERVICE_PORT>/api/v1`

### Booking APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/booking/` | Create a new booking. |
| `POST` | `/booking/payments` | Process a payment. |

### Ping
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/ping/` | Ping check (with request body validation). |
| `GET` | `/ping/health` | Simple health check. |

---

## 3. API Gateway - Local APIs
**Base URL**: `http://localhost:<GATEWAY_PORT>/api/v1`

These APIs are handled directly by the API Gateway service (Authentication & Authorization).

### User/Auth APIs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Ping check (Protected). |
| `POST` | `/signup` | User registration. |
| `POST` | `/signin` | User login. |
| `POST` | `/role` | Add role to user (Admin only). |

---

## 4. API Gateway - Proxy APIs
The API Gateway acts as a reverse proxy for the microservices. You can access the backend services through the gateway using the following mappings.

**Base URL**: `http://localhost:<GATEWAY_PORT>`

### Proxied Flight Service APIs
**Pattern**: `/flightsService/*` -> Forwarded to `Flight Service`

| Method | Gateway Endpoint | Target Service Endpoint |
| :--- | :--- | :--- |
| `POST` | `/flightsService/api/v1/airplane/` | `POST /api/v1/airplane/` |
| `GET` | `/flightsService/api/v1/airplane/` | `GET /api/v1/airplane/` |
| `GET` | `/flightsService/api/v1/airplane/:id` | `GET /api/v1/airplane/:id` |
| `PUT` | `/flightsService/api/v1/airplane/` | `PUT /api/v1/airplane/` |
| `DELETE` | `/flightsService/api/v1/airplane/:id` | `DELETE /api/v1/airplane/:id` |
| `POST` | `/flightsService/api/v1/city/` | `POST /api/v1/city/` |
| `GET` | `/flightsService/api/v1/city/` | `GET /api/v1/city/` |
| `GET` | `/flightsService/api/v1/city/:id` | `GET /api/v1/city/:id` |
| `PUT` | `/flightsService/api/v1/city/:id` | `PUT /api/v1/city/:id` |
| `DELETE` | `/flightsService/api/v1/city/:id` | `DELETE /api/v1/city/:id` |
| `POST` | `/flightsService/api/v1/airport/` | `POST /api/v1/airport/` |
| `GET` | `/flightsService/api/v1/airport/` | `GET /api/v1/airport/` |
| `GET` | `/flightsService/api/v1/airport/:id` | `GET /api/v1/airport/:id` |
| `PUT` | `/flightsService/api/v1/airport/` | `PUT /api/v1/airport/` |
| `DELETE` | `/flightsService/api/v1/airport/:id` | `DELETE /api/v1/airport/:id` |
| `POST` | `/flightsService/api/v1/flight/` | `POST /api/v1/flight/` |
| `GET` | `/flightsService/api/v1/flight/` | `GET /api/v1/flight/` |
| `GET` | `/flightsService/api/v1/flight/:id` | `GET /api/v1/flight/:id` |
| `PATCH` | `/flightsService/api/v1/flight/:id/seats` | `PATCH /api/v1/flight/:id/seats` |

### Proxied Booking Service APIs
**Pattern**: `/bookingService/*` -> Forwarded to `Booking Service`

| Method | Gateway Endpoint | Target Service Endpoint |
| :--- | :--- | :--- |
| `POST` | `/bookingService/api/v1/booking/` | `POST /api/v1/booking/` |
| `POST` | `/bookingService/api/v1/booking/payments` | `POST /api/v1/booking/payments` |
| `GET` | `/bookingService/api/v1/ping/` | `GET /api/v1/ping/` |
| `GET` | `/bookingService/api/v1/ping/health` | `GET /api/v1/ping/health` |
