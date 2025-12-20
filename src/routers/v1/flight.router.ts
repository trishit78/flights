import express from 'express';
import { createFlightHandler } from '../../controllers/flight.controller';


const flightRouter = express.Router();

flightRouter.post('/',createFlightHandler);

export default flightRouter;