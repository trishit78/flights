/// <reference path="./types/express.d.ts" />
import express, { Request, Response } from 'express';
import { serverConfig } from './config';
import v1Router from './routers/v1/index.router';
import v2Router from './routers/v2/index.router';
import { appErrorHandler, genericErrorHandler } from './middlewares/error.middleware';
import logger from './config/logger.config';
import { attachCorrelationIdMiddleware } from './middlewares/correlation.middleware';
import { scheduleCrons } from './utils/cronJob';

import {createBullBoard} from '@bull-board/api';
import {BullMQAdapter} from '@bull-board/api/bullMQAdapter';
import {ExpressAdapter} from '@bull-board/express';
import { mailerQueue } from './queue/mailer.queue';
import { attachUserContext } from './middlewares/context.middleware';
import cors from 'cors';

import client from 'prom-client';

const register = new client.Registry();
console.log(register)
client.collectDefaultMetrics({
    register:client.register
})

const app = express();

const bullServerAdapter = new ExpressAdapter();
bullServerAdapter.setBasePath('/ui');
createBullBoard({
    queues:[new BullMQAdapter(mailerQueue)],
    serverAdapter:bullServerAdapter
})
app.use(cors())
app.use(express.json());

/**
 * Registering all the routers and their corresponding routes with out app server object.
 */
app.use('/ui',bullServerAdapter.getRouter());
app.use(attachCorrelationIdMiddleware);
app.use(attachUserContext)
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router); 

app.get('/metrics',async(req:Request,res:Response)=>{
    res.setHeader('Content-Type',client.register.contentType);
    const metric = await client.register.metrics()
    res.send(metric)
})
/**
 * Add the error handler middleware
 */

app.use(appErrorHandler);
app.use(genericErrorHandler);


app.listen(serverConfig.PORT, () => {
    logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
    logger.info(`Press Ctrl+C to stop the server.`);
    scheduleCrons()


   
});
