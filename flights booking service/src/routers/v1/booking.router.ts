import express from 'express';
import { createBooking } from '../../controllers/booking.controller';

const bookingRouter = express.Router();

bookingRouter.get('/',createBooking);

export default bookingRouter;