import express from 'express';
import { createFlightSchema, flightByIdSchema, updateFlightSeatsSchema } from '../../validators/flightSchema';
import { validateRequestBody, validateUrlParams } from '../../validators';
import { createFlightHandler, getAllFlights, getFlights, updateFlightSeats } from '../../controllers/flight.controller';
import { metricsMiddleware } from '../../middlewares/metrics.middleware';


const flightRouter = express.Router();



flightRouter.post('/',validateRequestBody(createFlightSchema),createFlightHandler);
flightRouter.get('/',metricsMiddleware,getAllFlights);
flightRouter.get('/:id',validateUrlParams(flightByIdSchema),getFlights);
flightRouter.patch('/:id/seats',validateUrlParams(flightByIdSchema),validateRequestBody(updateFlightSeatsSchema),updateFlightSeats);



export default flightRouter;