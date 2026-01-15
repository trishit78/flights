# Flight Booking System

A comprehensive microservices-based application for booking flights, managing users, and sending notifications. This system is built using modern technologies with a focus on scalability, observability, and maintainability.

# Demo


https://github.com/user-attachments/assets/1d66f1cb-fe7d-46de-8e3c-d9f619f1b965









## 📋 Table of Contents

- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Database Design](#-database-design)
- [Services Overview](#-services-overview)
- [Monitoring & Observability](#-monitoring--observability)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)

---

## 🏗️ Architecture

The system follows a **microservices architecture** pattern with the following components:

```
┌─────────────┐
│   Frontend  │ (Next.js - Port 3000)
│   (Next.js) │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│   API Gateway   │ (Port 5000)
│  (Express.js)   │
└─────┬───────┬───┘
      │       │
      ▼       ▼
┌──────────┐ ┌──────────────────┐
│ Flights  │ │ Booking Service   │
│ Service  │ │ (Port 4000)       │
│(Port 3500)│ └─────────┬────────┘
└──────────┘            │
                        ▼
                ┌─────────────────┐
                │ Notification    │
                │ Service         │
                │ (Port 8000)     │
                └─────────────────┘
```

### Communication Patterns

- **Synchronous**: REST APIs via API Gateway
- **Asynchronous**: Redis Queue (BullMQ) for email notifications
- **Service Discovery**: Environment-based configuration
- **Authentication**: JWT-based authentication via API Gateway

---

## 🛠️ Tech Stack

### Backend Services

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Runtime** | Node.js | v18+ | JavaScript runtime |
| **Framework** | Express.js | v5.x | Web framework |
| **Language** | TypeScript | v5.x | Type-safe JavaScript |
| **ORM** | Prisma | v7.x | Database ORM |
| **Database** | MySQL | Latest | Primary database |
| **Cache/Queue** | Redis | Latest | Message queue & caching |
| **Authentication** | JWT (jsonwebtoken) | v9.x | Token-based auth |
| **Validation** | Zod | v3.x | Schema validation |
| **Logging** | Winston | v3.x | Structured logging |
| **Monitoring** | Prometheus | Latest | Metrics collection |
| **Visualization** | Grafana | Latest | Metrics visualization |

### Frontend

| Component | Technology | Version |
|-----------|-----------|---------|
| **Framework** | Next.js | 16.1.1 |
| **UI Library** | React | 19.2.3 |
| **Styling** | Tailwind CSS | v4 |
| **HTTP Client** | Axios | v1.13.2 |
| **UI Components** | Radix UI | Latest |

### DevOps & Infrastructure

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Containerization** | Docker | Service containerization |
| **Orchestration** | Docker Compose | Local development |
| **Metrics** | Prometheus | Metrics scraping |
| **Dashboards** | Grafana | Metrics visualization |
| **Queue Management** | Bull Board | Queue monitoring UI |

### Key Libraries

- **bcryptjs**: Password hashing
- **express-rate-limit**: Rate limiting
- **http-proxy-middleware**: API Gateway proxying
- **bullmq**: Redis-based job queue
- **nodemailer**: Email sending
- **handlebars**: Email templating
- **prom-client**: Prometheus metrics client
- **winston-daily-rotate-file**: Log rotation

---

## 🗄️ Database Design

### Database Schema Overview

The system uses **MySQL** as the primary database with three separate databases:

1. **`flights_booking`** - Flights Service (Inventory Management)
2. **`flights_dev`** - Booking Service (Bookings & Payments)
3. **`api_gateway_db`** - API Gateway (Users & Authentication)

### Database Relations

#### 1. Flights Service Database (`flights_booking`)

```
Cities (1) ──< (Many) Airport (1) ──< (Many) Flight
                │
                └──< (Many) Flight (Arrival)

Airplane (1) ──< (Many) Flight
Airplane (1) ──< (Many) Seat
```

**Entity Relationships:**

- **Cities** → **Airport** (One-to-Many)
  - One city can have multiple airports
  - `Airport.cityId` → `Cities.id` (CASCADE on delete/update)

- **Airport** → **Flight** (One-to-Many for Departures)
  - One airport can have multiple departing flights
  - `Flight.departureAirportId` → `Airport.code` (CASCADE on delete)

- **Airport** → **Flight** (One-to-Many for Arrivals)
  - One airport can have multiple arriving flights
  - `Flight.arrivalAirportId` → `Airport.code` (CASCADE on delete)

- **Airplane** → **Flight** (One-to-Many)
  - One airplane can be used in multiple flights
  - `Flight.airplaneId` → `Airplane.id` (CASCADE on delete)

- **Airplane** → **Seat** (One-to-Many)
  - One airplane has multiple seats
  - `Seat.airplaneId` → `Airplane.id` (CASCADE on delete)

**Tables:**

| Table | Key Fields | Relationships |
|-------|-----------|---------------|
| `Cities` | `id`, `city` (unique) | → `Airport` |
| `Airport` | `id`, `code` (unique), `name`, `cityId` | ← `Cities`, → `Flight` (departure/arrival) |
| `Airplane` | `id`, `modelNumber` (unique), `capacity` | → `Flight`, → `Seat` |
| `Flight` | `id`, `flightNumber` (unique), `airplaneId`, `departureAirportId`, `arrivalAirportId`, `totalSeats`, `price` | ← `Airplane`, ← `Airport` (2x) |
| `Seat` | `id`, `airplaneId`, `row`, `col`, `type` (enum) | ← `Airplane` |
| `user` | `id`, `email` (unique), `name` | - |

**Enums:**
- `SeatType`: `BUSINESS`, `ECONOMY`, `PREMIUM_ECONOMY`, `FIRST_CLASS`

#### 2. Booking Service Database (`flights_dev`)

```
User (External) ──< (Many) Bookings
Flight (External) ──< (Many) Bookings
```

**Entity Relationships:**

- **Bookings** references external `userId` and `flightId`
- No foreign key constraints (service boundary)

**Tables:**

| Table | Key Fields | Relationships |
|-------|-----------|---------------|
| `Bookings` | `id`, `flightId`, `userId`, `status` (enum), `noOfSeats`, `totalCost` | References external services |

**Enums:**
- `BookingStatus`: `BOOKED`, `CANCELLED`, `INITIATED`, `PENDING`

#### 3. API Gateway Database (`api_gateway_db`)

```
User (1) ──< (Many) UserRole (Many) ──> (1) Role
```

**Entity Relationships:**

- **User** → **UserRole** (One-to-Many)
  - One user can have multiple roles
  - `UserRole.userId` → `User.id` (CASCADE on delete)

- **Role** → **UserRole** (One-to-Many)
  - One role can be assigned to multiple users
  - `UserRole.roleId` → `Role.id` (CASCADE on delete)

- **UserRole** is a junction table with unique constraint on `[userId, roleId]`

**Tables:**

| Table | Key Fields | Relationships |
|-------|-----------|---------------|
| `User` | `id`, `email` (unique), `name`, `password` | → `UserRole` |
| `Role` | `id`, `name` (enum, unique) | → `UserRole` |
| `User_Roles` | `id`, `userId`, `roleId` | ← `User`, ← `Role` |

**Enums:**
- `ROLE`: `ADMIN`, `CUSTOMER`, `FLIGHT_COMPANY`

### Database Connection Strings

```env
# Flights Service
DATABASE_URL="mysql://root:password@localhost:3306/flights_booking"

# Booking Service
DATABASE_URL="mysql://root:password@localhost:3306/flights_dev"

# API Gateway
DATABASE_URL="mysql://root:password@localhost:3306/api_gateway_db"
```

---

## 🚀 Services Overview

### 1. API Gateway (`Port: 5000`)

**Purpose**: Single entry point for all client requests

**Responsibilities:**
- User authentication and authorization (JWT)
- Request routing and proxying to microservices
- Rate limiting
- Request validation

**Key Features:**
- JWT token generation and validation
- Role-based access control (RBAC)
- Proxy middleware for service routing
- Express rate limiting

**Database**: `api_gateway_db`

### 2. Flights Service (`Port: 3500`)

**Purpose**: Manages flight inventory and related entities

**Responsibilities:**
- CRUD operations for flights, airplanes, airports, cities
- Flight search and filtering
- Seat inventory management
- **Prometheus metrics collection**

**Key Features:**
- Advanced flight search with filters (price, date, routes)
- Real-time seat availability tracking
- Prometheus metrics endpoint (`/metrics`)
- Comprehensive logging with Winston

**Database**: `flights_booking`

**Monitoring Port**: `3500` (metrics endpoint)

### 3. Booking Service (`Port: 4000`)

**Purpose**: Handles booking lifecycle and payments

**Responsibilities:**
- Booking creation and management
- Payment processing
- Seat reservation coordination with Flights Service
- Email notification queue producer
- **Prometheus metrics collection**
- Cron jobs for expired booking cleanup

**Key Features:**
- Booking state management (INITIATED → BOOKED/CANCELLED)
- Idempotent payment processing
- Automatic cancellation of expired bookings (10-15 mins)
- Bull Board UI for queue monitoring (`/ui`)
- Prometheus metrics endpoint (`/metrics`)

**Database**: `flights_dev`

**Monitoring Port**: `4000` (metrics endpoint)

### 4. Notification Service (`Port: 8000`)

**Purpose**: Asynchronous email notification worker

**Responsibilities:**
- Consuming email jobs from Redis queue
- Rendering email templates (Handlebars)
- Sending emails via Nodemailer

**Key Features:**
- BullMQ worker for queue processing
- Template-based email rendering
- Retry mechanism for failed emails
- Scalable worker architecture

**No Database** (stateless worker)

### 5. Frontend (`Port: 3000`)

**Purpose**: User-facing web application

**Technology**: Next.js 16 with React 19

**Features:**
- Flight search interface
- Booking management
- User authentication UI

---

## 📊 Monitoring & Observability

### Prometheus & Grafana Setup

The system includes comprehensive monitoring for **Flights Service** and **Booking Service** using Prometheus and Grafana.

#### Prometheus Configuration

**Location**: `./prometheus.yml`

```yaml
global:
  scrape_interval: 2s

scrape_configs:
  - job_name: "flight-service"
    static_configs:
      - targets: ["192.168.1.187:3500"]

  - job_name: "booking-service"
    static_configs:
      - targets: ["192.168.1.187:4000"]

```

**Access**: `http://localhost:9090`

#### Grafana Configuration

**Access**: `http://localhost:3010` (default credentials: admin/admin)

**Data Source**: Prometheus at `http://localhost:9090` (or `http://prom-server:9090` if running in Docker network)

#### Metrics Endpoints

Both services expose metrics at `/metrics`:

- **Flights Service**: `http://localhost:3500/metrics`
- **Booking Service**: `http://localhost:4000/metrics`

### Metrics Collected

#### Flights Service Metrics

| Metric Name | Type | Description | Labels |
|------------|------|-------------|--------|
| `http_requests_total` | Counter | Total HTTP requests | `method`, `route`, `status_code` |
| `http_request_duration_ms` | Histogram | Request duration in milliseconds | `method`, `route`, `status_code` |
| `active_requests` | Gauge | Currently active requests | - |
| `flight_search_total` | Counter | Total flight searches | `has_price`, `has_date`, `has_trips` |
| `flight_search_results_count` | Histogram | Number of results per search | - |
| `process_*` | Gauge | Node.js process metrics (CPU, memory, etc.) | - |

#### Booking Service Metrics

| Metric Name | Type | Description | Labels |
|------------|------|-------------|--------|
| `http_requests_total_booking` | Counter | Total HTTP requests | `method`, `route`, `status_code` |
| `http_request_duration_seconds_booking` | Histogram | Request duration in seconds | `method`, `route`, `status_code` |
| `active_requests_booking` | Gauge | Currently active requests | - |
| `booking_attempts_total` | Counter | Total booking attempts | - |
| `booking_success_total` | Counter | Total successful bookings | - |
| `booking_failed_total` | Counter | Total failed bookings | `reason` |
| `booking_reservation_expired_total` | Counter | Expired reservations | - |
| `process_*` | Gauge | Node.js process metrics | - |

### Running Monitoring Stack

```bash
# Start Prometheus (Grafana needs to be set up separately or added to docker-compose)
docker-compose up 

# Access Prometheus
open http://localhost:9090

# Note: Grafana should be installed separately or added to docker-compose.yml
# Access Grafana (if configured)
open http://localhost:3010
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MySQL** (v8.0 or higher)
- **Redis** (v6.0 or higher)
- **Docker** & **Docker Compose** (for monitoring stack)
- **npm** or **yarn**

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd flights
```

2. **Install dependencies for each service**

```bash
# API Gateway
cd "api gateway" && npm install && cd ..

# Flights Service
cd "flights service" && npm install && cd ..

# Booking Service
cd "flights booking service" && npm install && cd ..

# Notification Service
cd "notification service" && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..
```

3. **Set up databases**

Create three MySQL databases:
```sql
CREATE DATABASE flights_booking;
CREATE DATABASE flights_dev;
CREATE DATABASE api_gateway_db;
```

4. **Configure environment variables**

Create `.env` files in each service directory (see individual service READMEs for details).

5. **Run Prisma migrations**

```bash
# Flights Service
cd "flights service"
npx prisma migrate dev
npx prisma generate

# Booking Service
cd "../flights booking service"
npx prisma migrate dev
npx prisma generate

# API Gateway
cd "../api gateway"
npx prisma migrate dev
npx prisma generate
```

### Running the Services

**Option 1: Manual (Development)**

Open 5 separate terminals:

```bash
# Terminal 1: Flights Service
cd "flights service" && npm run dev

# Terminal 2: Booking Service
cd "flights booking service" && npm run dev

# Terminal 3: Notification Service
cd "notification service" && npm run dev

# Terminal 4: API Gateway
cd "api gateway" && npm run dev

# Terminal 5: Frontend
cd frontend && npm run dev
```

**Option 2: Docker Compose (Monitoring Stack)**

```bash
# Start Prometheus and Grafana
docker-compose up 

docker run -d -p 3010:3000 --name=grafana grafana/grafana-oss
```

### Service Ports

| Service | Port | Health Check |
|---------|------|--------------|
| API Gateway | 5000 | `http://localhost:5000/api/v1/ping` |
| Flights Service | 3500 | `http://localhost:3500/api/v1/ping` |
| Booking Service | 4000 | `http://localhost:4000/api/v1/ping` |
| Notification Service | 8000 | `http://localhost:8000/api/v1/ping` |
| Frontend | 3000 | `http://localhost:3000` |
| Prometheus | 9090 | `http://localhost:9090` |
| Grafana | 3010 | `http://localhost:3010` (if configured) |

---

## 📚 API Documentation

See [API_DOC.md](./API_DOC.md) for detailed API documentation.

### Quick Reference

**Base URL**: `http://localhost:5000` (via API Gateway)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/v1/signup` | Register user | ❌ |
| `POST` | `/api/v1/signin` | Login | ❌ |
| `GET` | `/flightsService/api/v1/flight` | Search flights | ❌ |
| `POST` | `/flightsService/api/v1/flight` | Create flight | ✅ (Admin) |
| `POST` | `/bookingService/api/v1/booking` | Create booking | ✅ |
| `POST` | `/bookingService/api/v1/booking/payments` | Process payment | ✅ |

---

## 🚢 Deployment

### Environment Variables

Each service requires specific environment variables. See individual service READMEs:

- [API Gateway README](./api%20gateway/README.md)
- [Flights Service README](./flights%20service/README.md)
- [Booking Service README](./flights%20booking%20service/README.md)
- [Notification Service README](./notification%20service/README.md)

### Production Considerations

1. **Database**: Use managed MySQL (RDS, Cloud SQL, etc.)
2. **Redis**: Use managed Redis (ElastiCache, Cloud Memorystore, etc.)
3. **Monitoring**: Configure Prometheus for production scraping
4. **Logging**: Set up centralized logging (ELK, CloudWatch, etc.)
5. **Security**: 
   - Use strong JWT secrets
   - Enable HTTPS/TLS
   - Configure CORS properly
   - Set up rate limiting
6. **Scaling**: Services are stateless and can be horizontally scaled
7. **Health Checks**: Implement proper health check endpoints for load balancers
