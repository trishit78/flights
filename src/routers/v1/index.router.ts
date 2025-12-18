import express from 'express';
import pingRouter from './ping.router';
import airplaneRouter from './airplane.router';
import cityRouter from './city.router';

const v1Router = express.Router();



v1Router.use('/ping',  pingRouter);
v1Router.use('/airplane',  airplaneRouter);
v1Router.use('/city',  cityRouter);

export default v1Router;