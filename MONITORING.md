# 📊 Observability & Monitoring – Flight Platform

This document explains the **Prometheus + Grafana-based monitoring** added to the Flight platform, covering **two services** and **three critical APIs**.

---

## 🧩 Services Covered

### 1. **Flight Service**

Responsible for:
- Flight search
- Filtering (price, date, trips)
- Read-heavy API traffic

### 2. **Flight Booking Service**

Responsible for:
- Booking creation
- Payment initiation
- Booking expiry (cron-based cleanup)

Each service exposes its **own Prometheus `/metrics` endpoint** and has a **dedicated Grafana dashboard**.

---

## 🔧 Instrumentation Stack

- **prom-client** – metric collection
- **Prometheus** – scraping & storage
- **Grafana** – visualization
- **Express middleware** – request-level metrics

---

## 📈 Metrics Overview

### Common HTTP / System Metrics (Both Services)

| Metric | Type | Purpose |
|--------|------|---------|
| `http_requests_total_*` | Counter | Total requests by method, route, status |
| `http_request_duration_seconds_*` | Histogram | API latency distribution |
| `active_requests_*` | Gauge | In-flight requests |
| `process_cpu_seconds_total` | Counter | CPU usage |
| `process_resident_memory_bytes` | Gauge | Memory usage |
| `event_loop_lag_seconds` | Gauge | Node.js event loop health |

---

## ✈️ Flight Service – Search Metrics

### Business Metrics

#### `flight_search_total`

Tracks **how users search for flights**.

**Labels:**
- `has_price`
- `has_date`
- `has_trips`

This allows answering questions like:
- Are users filtering by price or date?
- Which combinations are most common?
- Are we optimizing the right search paths?

#### `flight_search_results_count` (Histogram)

Tracks **number of results returned per search**, useful for:
- Detecting empty searches
- Oversized responses
- Query optimization

---

### 📊 Flight Service Dashboard

<img width="1920" height="2007" alt="Flight Service -Dashboards-Grafana" src="https://github.com/user-attachments/assets/587bae68-28b0-415d-8881-721a43622363" />


**Key Panels:**
- Flight search filter usage (stacked view)
- Request latency buckets
- Active search requests
- CPU & memory usage
- Event loop lag
- Process restarts

This dashboard helps identify:
- Slow search queries
- Load spikes
- Memory leaks
- Inefficient filters

---

## 🧾 Flight Booking Service – Booking Funnel Metrics

### Business Metrics

#### `booking_attempts_total`

Total booking attempts initiated.

#### `booking_success_total`

Successful booking creations.

#### `booking_failed_total{reason}`

Failures categorized by **explicit reason**:
- `AUTH_FAILED`
- `NO_SEATS`
- `INVALID_FLIGHT`

#### `booking_reservation_expired_total`

Tracks bookings that expired before payment (cron-based).

This metric directly reflects:
- User drop-offs
- Payment friction
- UX issues

---

### 📊 Booking Funnel Logic

```
Attempt → Success
        → Failed (reason)
        → Expired (no payment)
```

This is a **true business funnel**, not just request counts.

---

### 📊 Flight Booking Dashboard

<img width="1920" height="2280" alt="Flight Booking-Dashboards-Grafana" src="https://github.com/user-attachments/assets/fd0a2fac-ce96-46e9-9c44-8e1fdef49eb4" />


**Key Panels:**
- Booking attempts vs success (pie)
- Expired vs paid bookings (time series)
- Booking request rates
- Request latency
- CPU & memory usage
- Active requests & handlers

This dashboard answers:
- Are users completing bookings?
- Where are they dropping?
- Are failures increasing?
- Is infra impacting booking success?

---

## 🔍 How to Use This Monitoring

### Detect Issues

- Rising `booking_failed_total{reason}` → business logic or auth issues
- Increasing latency buckets → performance regressions
- Growing expired bookings → payment UX problems

### Capacity Planning

- Track peak active requests
- CPU/memory trends over time

### Product Decisions

- Identify most-used search filters
- Optimize common search paths

---

## 📝 Notes

- Metrics are **namespaced per service** to avoid collisions.
- Units follow Prometheus conventions (`seconds`, counters only increase).
- Middleware ensures **consistent coverage** across APIs.
- Business metrics are emitted **only where domain events occur**, not blindly at middleware level.

---
