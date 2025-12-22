import express from 'express';
import { createFlightHandler, getAllFlights, getFlights, updateFlightSeats } from '../../controllers/flight.controller';


const flightRouter = express.Router();

flightRouter.post('/',createFlightHandler);
flightRouter.get('/',getAllFlights);
flightRouter.get('/:id',getFlights);
flightRouter.patch('/:id/seats',updateFlightSeats);



export default flightRouter;