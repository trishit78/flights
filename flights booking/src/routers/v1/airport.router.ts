import express from 'express';

import { createAirportHandler, deleteAirportHandler, getAirportHandler, getAllAirportHandler, updateAirportDetails } from '../../controllers/airport.controller';


const airportRouter = express.Router();

airportRouter.post('/',createAirportHandler);
airportRouter.get('/',getAirportHandler);
airportRouter.get('/:id',getAllAirportHandler);
airportRouter.put('/',updateAirportDetails);
airportRouter.delete('/:id',deleteAirportHandler);

export default airportRouter;