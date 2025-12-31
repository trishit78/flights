# Flights Booking Service

The **Booking Service** handles the reservation logic. It consumes flight data, manages booking states (Initiated, Booked, Cancelled), and publishes events for email notifications. This service is instrumented with **Prometheus metrics** for comprehensive monitoring and observability.

## ⚙️ Configuration (.env)

Create a `.env` file in this directory:

```env
PORT=4000
# Database Connection (MySQL)
DATABASE_URL="mysql://root:password@localhost:3306/flights_dev"

# Service Discovery
FLIGHT_SERVICE="http://localhost:3500"
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
    *   **Response:** Returns booking ID and status (INITIATED).

*   `POST /booking/payments`
    *   **Description:** Confirms payment and finalizes the booking.
    *   **Body:** `{ "bookingId": 123, "totalCost": 5000 }`
    *   **Headers:** `x-idempotency-key: <unique-key>` (required for idempotency)
    *   **Auth:** Requires Bearer Token.
    *   **Response:** Confirms booking and triggers email notification.

### 🔍 Health Check
*   `GET /ping` - Health check endpoint.

### 📊 Metrics Endpoint
*   `GET /metrics` - Prometheus metrics endpoint (exposes all collected metrics).

### 🎛️ Queue Management UI
*   `GET /ui` - Bull Board UI for monitoring Redis queues (mailer queue).

---

## 📊 Monitoring & Observability

### Prometheus Integration

The Booking Service is fully instrumented with **Prometheus metrics** for monitoring booking operations, payment processing, and system health.

#### Metrics Endpoint

The service exposes metrics at:
```
http://localhost:4000/metrics
```

#### Collected Metrics

##### HTTP Request Metrics

| Metric Name | Type | Description | Labels |
|------------|------|-------------|--------|
| `http_requests_total_booking` | Counter | Total number of HTTP requests received | `method`, `route`, `status_code` |
| `http_request_duration_seconds_booking` | Histogram | Duration of HTTP requests in seconds | `method`, `route`, `status_code` |
| `active_requests_booking` | Gauge | Number of currently active (in-flight) requests | - |

**Histogram Buckets**: `[0.1, 0.3, 0.5, 0.7, 0.9, 1, 2, 3]` seconds

##### Business Metrics (Booking-Specific)

| Metric Name | Type | Description | Labels |
|------------|------|-------------|--------|
| `booking_attempts_total` | Counter | Total number of booking attempts | - |
| `booking_success_total` | Counter | Total number of successful bookings | - |
| `booking_failed_total` | Counter | Total number of failed bookings | `reason` |
| `booking_reservation_expired_total` | Counter | Number of booking reservations that expired before payment | - |

**Failure Reasons:**
- `AUTH_FAILED` - Authentication/authorization failure
- `INSUFFICIENT_SEATS` - Not enough seats available
- `FLIGHT_NOT_FOUND` - Flight does not exist
- `PAYMENT_FAILED` - Payment processing failure
- `INVALID_BOOKING` - Invalid booking state or data

##### System Metrics (Default)

Prometheus client automatically collects Node.js process metrics:
- `process_cpu_user_seconds_total` - CPU time spent in user mode
- `process_cpu_system_seconds_total` - CPU time spent in system mode
- `process_resident_memory_bytes` - Resident memory size
- `nodejs_heap_size_total_bytes` - Total heap size
- `nodejs_heap_size_used_bytes` - Used heap size
- `nodejs_eventloop_lag_seconds` - Event loop lag
- And more...

#### Metrics Middleware

All routes are instrumented with `metricMiddleware` that automatically:
1. Increments `active_requests_booking` gauge at request start
2. Records request duration in `http_request_duration_seconds_booking` histogram
3. Increments `http_requests_total_booking` counter with labels
4. Decrements `active_requests_booking` gauge at request completion

#### Business Metrics Collection

Booking-specific metrics are collected in controllers:

- **`booking_attempts_total`**: Incremented on every booking creation attempt
- **`booking_success_total`**: Incremented on successful booking creation
- **`booking_failed_total`**: Incremented on booking failures with reason label
- **`booking_reservation_expired_total`**: Incremented by cron job when cleaning up expired bookings

#### Prometheus Configuration

Add this to your `prometheus.yml`:

```yaml
scrape_configs:
  - job_name: "booking-service"
    static_configs:
      - targets: ["localhost:4000"]  # Or your server IP
    scrape_interval: 2s
```

#### Grafana Dashboards

Recommended Grafana panels:

1. **Request Rate**: `rate(http_requests_total_booking[5m])`
2. **Request Duration (p95)**: `histogram_quantile(0.95, http_request_duration_seconds_booking_bucket)`
3. **Error Rate**: `rate(http_requests_total_booking{status_code=~"5.."}[5m])`
4. **Active Requests**: `active_requests_booking`
5. **Booking Success Rate**: `rate(booking_success_total[5m]) / rate(booking_attempts_total[5m])`
6. **Booking Failure Rate by Reason**: `rate(booking_failed_total[5m]) by (reason)`
7. **Expired Reservations**: `rate(booking_reservation_expired_total[5m])`
8. **Memory Usage**: `process_resident_memory_bytes`
9. **CPU Usage**: `rate(process_cpu_user_seconds_total[5m])`

### Queue Monitoring (Bull Board)

The service includes **Bull Board** UI for monitoring Redis queues:

**Access**: `http://localhost:4000/ui`

**Features:**
- View queue status and job counts
- Monitor job processing
- View failed jobs
- Retry failed jobs
- Clear queues

**Queue Name**: `queue-mailer`

### Logging

The service uses **Winston** for structured logging with daily log rotation:
- Log files: `logs/YYYY-MM-DD-app.log`
- Log levels: `error`, `warn`, `info`, `debug`
- Includes correlation IDs for request tracing

---

## 🔄 Cron Jobs & Workers

### Automatic Booking Cleanup

**Cron Job**: Automatically cancels "Old Bookings" (INITIATED but not paid within 10-15 mins) and releases the seats back to the Flight Service.

**Schedule**: Runs periodically (configured in `src/utils/cronJob.ts`)

**Process:**
1. Finds all bookings with status `INITIATED` older than threshold
2. Updates booking status to `CANCELLED`
3. Calls Flights Service to release reserved seats
4. Increments `booking_reservation_expired_total` metric

### Queue Producer

**Queue**: `queue-mailer` (Redis/BullMQ)

**Trigger**: Upon successful payment confirmation (`makePaymentService`)

**Action**: Pushes email notification tasks to the Redis queue

**Payload Structure**:
```json
{
  "to": "user@example.com",
  "subject": "Flight Booking Confirmed",
  "templateId": "booking_success",
  "params": {
    "name": "John Doe",
    "bookingId": 123
  }
}
```

**Consumer**: Notification Service (Port 8000)

---

## 🏗️ Architecture

### Database Schema

**Database**: `flights_dev`

**Tables:**
- `Bookings` - Booking records with status tracking

**Booking States:**
- `INITIATED` - Booking created, payment pending
- `BOOKED` - Payment confirmed, booking finalized
- `CANCELLED` - Booking cancelled (expired or user-initiated)
- `PENDING` - Reserved state (not commonly used)

**Relationships:**
- `Bookings` references external `userId` (from API Gateway)
- `Bookings` references external `flightId` (from Flights Service)
- No foreign key constraints (service boundary pattern)

### Service Flow

```
Client Request (with JWT)
    ↓
API Gateway (validates JWT)
    ↓
Booking Service (Port 4000)
    ↓
Metrics Middleware (collects metrics)
    ↓
Auth Middleware (extracts user context)
    ↓
Route Handler
    ↓
Service Layer
    ├──→ Flights Service API (check availability)
    ├──→ Database (create/update booking)
    └──→ Redis Queue (publish email job)
    ↓
Response to Client
```

### Booking Lifecycle

```
1. POST /booking
   └──> Status: INITIATED
        └──> Seats reserved in Flights Service
             └──> Timer starts (10-15 mins)

2. POST /booking/payments (within time limit)
   └──> Status: BOOKED
        └──> Email notification queued
             └──> Payment confirmed

3. Cron Job (if payment not received)
   └──> Status: CANCELLED
        └──> Seats released in Flights Service
             └──> Metric incremented
```

---

## 🚀 Running the Service

### Development

```bash
npm install
npm run dev
```

The service will start on `http://localhost:4000`

### Production

```bash
npm install
npm run build
npm start
```

### Health Check

```bash
curl http://localhost:4000/api/v1/ping
```

### Metrics Endpoint

```bash
curl http://localhost:4000/metrics
```

### Queue UI

Open `http://localhost:4000/ui` in your browser

---

## 🔧 Dependencies

### Core Dependencies
- `express` (v5.1.0) - Web framework
- `@prisma/client` (v7.2.0) - Database ORM
- `prom-client` (v15.1.3) - Prometheus metrics client
- `bullmq` (v5.66.2) - Redis-based job queue
- `ioredis` (v5.8.2) - Redis client
- `axios` (v1.13.2) - HTTP client for service calls
- `jsonwebtoken` (v9.0.3) - JWT verification
- `node-cron` (v4.2.1) - Cron job scheduling
- `@bull-board/express` (v6.16.1) - Queue monitoring UI
- `winston` (v3.17.0) - Logging
- `zod` (v3.24.2) - Schema validation
- `cors` (v2.8.5) - CORS middleware

### Development Dependencies
- `typescript` (v5.8.3)
- `ts-node` (v10.9.2)
- `nodemon` (v3.1.9)
- `prisma` (v7.2.0)

---

## 🔐 Security Features

- **JWT Authentication**: All booking endpoints require valid JWT token
- **User Context**: User ID extracted from JWT and attached to requests
- **Idempotency**: Payment endpoint supports idempotency keys
- **Input Validation**: All inputs validated using Zod schemas

---
