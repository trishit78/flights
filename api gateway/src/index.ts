import express from 'express';
import { serverConfig } from './config/index.js';
import apiRouter from './routers/index.js';

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.use('/api',apiRouter);


app.listen(serverConfig.PORT,()=>{
    console.log(`server is on port ${serverConfig.PORT}`);
})