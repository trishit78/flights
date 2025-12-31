import express, { Request, Response } from 'express';
import { serverConfig } from './config';
import v1Router from './routers/v1/index.router';
import v2Router from './routers/v2/index.router';
import { appErrorHandler, genericErrorHandler } from './middlewares/error.middleware';
import logger from './config/logger.config';
import { attachCorrelationIdMiddleware } from './middlewares/correlation.middleware';
import cors from 'cors';

import client from 'prom-client'


export const register = new client.Registry();

client.collectDefaultMetrics({
    register:client.register
});



const app = express();
app.use(cors())
app.use(express.json());

app.use(attachCorrelationIdMiddleware);
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router); 
app.get('/metrics',async(_req:Request,res:Response)=>{
    res.setHeader('Content-Type',client.register.contentType);
    const metrics =await client.register.metrics();
    res.send(metrics);
})

app.use(appErrorHandler);
app.use(genericErrorHandler);


app.listen(serverConfig.PORT, async() => {
    logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
    logger.info(`Press Ctrl+C to stop the server.`);

});
