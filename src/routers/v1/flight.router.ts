import express from 'express';
import { createFlightHandler, getAllFlights } from '../../controllers/flight.controller';


const flightRouter = express.Router();

flightRouter.post('/',createFlightHandler);
flightRouter.get('/',getAllFlights);

export default flightRouter;