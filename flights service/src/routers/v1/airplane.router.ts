import express from 'express';
import { createAirplaneHandler, deleteAirplaneHandler, getAirplaneHandler, getAllAirplaneHandler, updateAirplaneHandler } from '../../controllers/airplane.controller';

import {  validateRequestBody, validateUrlParams } from '../../validators';
import { airplaneByIdSchema, airplaneSchema } from '../../validators/airplaneSchema';


const airplaneRouter = express.Router();

airplaneRouter.post('/',validateRequestBody(airplaneSchema),createAirplaneHandler);
airplaneRouter.get('/',getAllAirplaneHandler);
airplaneRouter.get('/:id',validateUrlParams(airplaneByIdSchema),getAirplaneHandler);
airplaneRouter.put('/',validateRequestBody(airplaneSchema),updateAirplaneHandler);
airplaneRouter.delete('/:id',validateUrlParams(airplaneByIdSchema),deleteAirplaneHandler);

export default airplaneRouter;