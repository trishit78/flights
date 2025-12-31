# Flights Service

The **Flights Service** manages the core inventory of the application. It handles the creation and retrieval of flights, airplanes, airports, and cities. This service is instrumented with **Prometheus metrics** for comprehensive monitoring and observability.

## ⚙️ Configuration (.env)

Create a `.env` file in this directory:

```env
PORT=3500
# Database Connection (MySQL)
DATABASE_URL="mysql://root:password@localhost:3306/flights_booking"
```

**Note**: The service runs on port **3500** (not 3000) to avoid conflicts with the frontend. This port is configured in Prometheus for metrics scraping.

## 📡 API Endpoints

**Base URL:** `/api/v1`

### ✈️ Airplanes
*   `POST /airplane` - Create a new airplane.
*   `GET /airplane` - Get all airplanes.
*   `GET /airplane/:id` - Get airplane details.
*   `DELETE /airplane/:id` - Delete an airplane.
*   `PATCH /airplane/:id` - Update an airplane.

### 🏙️ Cities
*   `POST /city` - Create a new city.
*   `GET /city` - List all cities.
*   `DELETE /city/:id` - Delete a city.
*   `PATCH /city/:id` - Update city details.

### 🛫 Airports
*   `POST /airport` - Create a new airport.
*   `GET /airport` - List all airports.
*   `GET /airport/:id` - Get airport details.
*   `DELETE /airport/:id` - Delete airport.
*   `PATCH /airport/:id` - Update airport details.

### 🎫 Flights
*   `POST /flight` - Create a new flight (Schedule a flight).
*   `GET /flight` - Search/List flights (supports query params).
    *   **Query Parameters:**
        *   `trips`: `{departureCode}-{arrivalCode}` (e.g., `DEL-BOM`)
        *   `tripdate`: `YYYY-MM-DD` format
        *   `price`: `{min}-{max}` (e.g., `1000-5000`)
        *   `travellers`: Number of seats required
        *   `sort`: `{field}_{order}` (e.g., `price_asc`, `departureTime_desc`)
*   `GET /flight/:id` - Get flight details.
*   `PATCH /flight/:id/seats` - Update remaining seats (Internal/System use).

### 🔍 Health Check
*   `GET /ping` - Health check endpoint.

### 📊 Metrics Endpoint
*   `GET /metrics` - Prometheus metrics endpoint (exposes all collected metrics).

---

## 📊 Monitoring & Observability

### Prometheus Integration

The Flights Service is fully instrumented with **Prometheus metrics** for monitoring application performance, request patterns, and business metrics.

#### Metrics Endpoint

The service exposes metrics at:
```
http://localhost:3500/metrics
```

#### Collected Metrics

##### HTTP Request Metrics

| Metric Name | Type | Description | Labels |
|------------|------|-------------|--------|
| `http_requests_total` | Counter | Total number of HTTP requests received | `method`, `route`, `status_code` |
| `http_request_duration_ms` | Histogram | Duration of HTTP requests in milliseconds | `method`, `route`, `status_code` |
| `active_requests` | Gauge | Number of currently active (in-flight) requests | - |

**Histogram Buckets**: `[50, 100, 200, 500, 1000, 2000, 3000, 5000]` milliseconds

##### Business Metrics

| Metric Name | Type | Description | Labels |
|------------|------|-------------|--------|
| `flight_search_total` | Counter | Total number of flight searches performed | `has_price`, `has_date`, `has_trips` |
| `flight_search_results_count` | Histogram | Number of flight results returned per search | - |

**Search Metric Labels:**
- `has_price`: `"true"` or `"false"` - Whether price filter was used
- `has_date`: `"true"` or `"false"` - Whether date filter was used
- `has_trips`: `"true"` or `"false"` - Whether route filter was used

**Results Histogram Buckets**: `[0, 1, 5, 10, 20, 50, 100]` results

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

All routes are instrumented with `metricsMiddleware` that automatically:
1. Increments `active_requests` gauge at request start
2. Records request duration in `http_request_duration_ms` histogram
3. Increments `http_requests_total` counter with labels
4. Decrements `active_requests` gauge at request completion

#### Prometheus Configuration

Add this to your `prometheus.yml`:

```yaml
scrape_configs:
  - job_name: "flight-service"
    static_configs:
      - targets: ["localhost:3500"]  # Or your server IP
    scrape_interval: 2s
```

#### Grafana Dashboards

Recommended Grafana panels:

1. **Request Rate**: `rate(http_requests_total[5m])`
2. **Request Duration (p95)**: `histogram_quantile(0.95, http_request_duration_ms_bucket)`
3. **Error Rate**: `rate(http_requests_total{status_code=~"5.."}[5m])`
4. **Active Requests**: `active_requests`
5. **Flight Search Trends**: `rate(flight_search_total[5m])`
6. **Search Results Distribution**: `histogram_quantile(0.95, flight_search_results_count_bucket)`
7. **Memory Usage**: `process_resident_memory_bytes`
8. **CPU Usage**: `rate(process_cpu_user_seconds_total[5m])`

### Logging

The service uses **Winston** for structured logging with daily log rotation:
- Log files: `logs/YYYY-MM-DD-app.log`
- Log levels: `error`, `warn`, `info`, `debug`
- Includes correlation IDs for request tracing

---

## 🏗️ Architecture

### Database Schema

**Database**: `flights_booking`

**Tables:**
- `Cities` - City information
- `Airport` - Airport details (linked to Cities)
- `Airplane` - Airplane models and capacity
- `Flight` - Flight schedules (linked to Airplanes and Airports)
- `Seat` - Seat configurations per airplane
- `user` - User information (legacy, managed by API Gateway)

**Relationships:**
- `Cities` (1) → (Many) `Airport`
- `Airport` (1) → (Many) `Flight` (departure)
- `Airport` (1) → (Many) `Flight` (arrival)
- `Airplane` (1) → (Many) `Flight`
- `Airplane` (1) → (Many) `Seat`

See root [README.md](../README.md) for detailed database design.

### Service Flow

```
Client Request
    ↓
API Gateway (Port 5000)
    ↓
Flights Service (Port 3500)
    ↓
Metrics Middleware (collects metrics)
    ↓
Route Handler
    ↓
Service Layer
    ↓
Repository Layer
    ↓
Prisma ORM → MySQL Database
```

---

## 🚀 Running the Service

### Development

```bash
npm install
npm run dev
```

The service will start on `http://localhost:3500`

### Production

```bash
npm install
npm run build
npm start
```

### Health Check

```bash
curl http://localhost:3500/api/v1/ping
```

### Metrics Endpoint

```bash
curl http://localhost:3500/metrics
```

---

## 🔧 Dependencies

### Core Dependencies
- `express` (v5.1.0) - Web framework
- `@prisma/client` (v7.1.0) - Database ORM
- `prom-client` (v15.1.3) - Prometheus metrics client
- `winston` (v3.17.0) - Logging
- `zod` (v3.25.76) - Schema validation
- `cors` (v2.8.5) - CORS middleware

### Development Dependencies
- `typescript` (v5.9.3)
- `ts-node` (v10.9.2)
- `nodemon` (v3.1.9)
- `prisma` (v7.1.0)

---
