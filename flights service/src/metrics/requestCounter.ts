import client from 'prom-client';

export const requestCounter= new client.Counter({
    name:"http_requests_total",
    help:"Total number of requests",  
    labelNames:["method","route","status_code"]
})

export const searchFlightRequestCounter = new client.Counter({
  name:"flight_search_total",
  help:"Total number of searches for a flight by fliter",
  labelNames:['has_price','has_date','has_trips']  
})