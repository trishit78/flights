import express from 'express';
import { createCityHandler, deleteCityHandler, getAllCitiesHandler, getCityHandler, updateCityDetails } from '../../controllers/city.controller';


const cityRouter = express.Router();

cityRouter.post('/',createCityHandler);
cityRouter.get('/:id',getCityHandler);
cityRouter.get('/',getAllCitiesHandler);
cityRouter.put('/:id',updateCityDetails);
cityRouter.delete('/:id',deleteCityHandler);

export default cityRouter;