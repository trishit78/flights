# Flights Service

The **Flights Service** manages the core inventory of the application. It handles the creation and retrieval of flights, airports, cities, and airplanes.

## ⚙️ Configuration (.env)

Create a `.env` file in this directory:

```env
PORT=3000
# Database Connection (MySQL)
DATABASE_URL="mysql://root:password@localhost:3306/flights_booking"
```

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

### 🎫 Flights
*   `POST /flight` - Create a new flight (Schedule a flight).
*   `GET /flight` - Search/List flights (supports query params).
*   `GET /flight/:id` - Get flight details.
*   `PATCH /flight/:id/seats` - Update remaining seats (Internal/System use).
