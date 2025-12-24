import express from 'express';
import { serverConfig } from './config/index.js';
import apiRouter from './routers/index.js';
import rateLimit from 'express-rate-limit';
import * as proxy from 'http-proxy-middleware';


const app = express();
const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 2 minutes
	max: 10, // Limit each IP to 10 requests per `window`
});



app.use(limiter);

const flightProxyOptions:proxy.Options & { target: string ,changeOrigin:boolean} = {
  target: serverConfig.FLIGHT_SERVICE,
  changeOrigin: true,
  pathRewrite: {
    '^/flightsService': '/'
  }
};

const bookingProxyOptions:proxy.Options & { target: string ,changeOrigin:boolean} = {
  target: serverConfig.BOOKING_SERVICE,
  changeOrigin: true,
  pathRewrite: {
    '^/bookingService': '/'
  }
};


app.use(
  '/bookingService',
  proxy.createProxyMiddleware(bookingProxyOptions)
);
app.use(
  '/flightsService',
  proxy.createProxyMiddleware(flightProxyOptions)
);

app.use(express.json());
app.use(express.urlencoded({extended: true}));







app.use('/api',apiRouter);


app.listen(serverConfig.PORT,()=>{
    console.log(`server is on port ${serverConfig.PORT}`);
})

