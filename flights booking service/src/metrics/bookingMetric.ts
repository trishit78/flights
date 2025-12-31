import client from "prom-client";

export const bookingAttemptsTotal = new client.Counter({
  name: "booking_attempts_total",
  help: "Total number of booking attempts",
});

export const bookingSuccessTotal = new client.Counter({
  name: "booking_success_total",
  help: "Total number of successful bookings",
});

export const bookingFailedTotal = new client.Counter({
  name: "booking_failed_total",
  help: "Total number of failed bookings by reason",
  labelNames: ["reason"],
});



export const bookingReservationExpiredTotal = new client.Counter({
  name: "booking_reservation_expired_total",
  help: "Total number of booking reservations that expired before payment",
});
