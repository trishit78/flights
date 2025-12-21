import express from 'express';
import { createAirplaneHandler, deleteAirplaneHandler, getAirplaneHandler, getAllAirplaneHandler, updateAirplaneHandler } from '../../controllers/airplane.controller';

import { validateCreateAirplane } from '../../middlewares/airplane.middleware';


const airplaneRouter = express.Router();

airplaneRouter.post('/',validateCreateAirplane,createAirplaneHandler);
airplaneRouter.get('/',getAllAirplaneHandler);
airplaneRouter.get('/:id',getAirplaneHandler);
airplaneRouter.put('/',updateAirplaneHandler);
airplaneRouter.delete('/:id',deleteAirplaneHandler);

export default airplaneRouter;