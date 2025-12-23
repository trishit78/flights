import express from 'express';
import { createBooking, makePayment } from '../../controllers/booking.controller';

const bookingRouter = express.Router();

bookingRouter.post('/',createBooking);
bookingRouter.post('/payments',makePayment);

export default bookingRouter;