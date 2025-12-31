import client from 'prom-client';

export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds_booking',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5,0.7,0.9, 1, 2, 3]
});