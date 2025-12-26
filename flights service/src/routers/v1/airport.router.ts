import express from 'express';

import { createAirportHandler, deleteAirportHandler, getAirportHandler, getAllAirportHandler, updateAirportDetails } from '../../controllers/airport.controller';
import { validateRequestBody, validateUrlParams } from '../../validators';
import { airportByIdSchema, airportSchema, updateAirportSchema } from '../../validators/airportSchema';


const airportRouter = express.Router();

airportRouter.post('/',validateRequestBody(airportSchema),createAirportHandler);
airportRouter.get('/',getAllAirportHandler);
airportRouter.get('/:id',validateUrlParams(airportByIdSchema),getAirportHandler);
airportRouter.put('/:id',validateRequestBody(updateAirportSchema),validateUrlParams(airportByIdSchema),updateAirportDetails);
airportRouter.delete('/:id',validateUrlParams(airportByIdSchema),deleteAirportHandler);

export default airportRouter;