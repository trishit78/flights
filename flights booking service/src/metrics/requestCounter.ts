import client from 'prom-client';


export const requestCounter = new client.Counter({
    name:'http_requests_total_booking',
    help:'Total number of requests',
    labelNames:['method','route','status_code']
})