import express from 'express';
import { createAirplaneHandler } from '../../controllers/airplane.controller';


const airplaneRouter = express.Router();

airplaneRouter.post('/',createAirplaneHandler);

export default airplaneRouter;