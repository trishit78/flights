import client from 'prom-client';

export const httpRequestDurationinMS = new client.Histogram({
    name:'http_request_duration_ms',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
     buckets: [50, 100, 200, 500, 1000, 2000, 3000, 5000]

})

export const flightSearchResultsHistogram = new client.Histogram({
  name: "flight_search_results_count",
  help: "Number of flight results returned per search",
  buckets: [0, 1, 5, 10, 20, 50, 100],
});