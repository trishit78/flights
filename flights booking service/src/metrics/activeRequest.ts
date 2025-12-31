import client from 'prom-client';

export const activeRequest = new client.Gauge({
    name:'active_requests_booking',
    help:'Number of active requests'
})