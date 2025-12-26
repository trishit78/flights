import express from 'express';
import { createBooking, makePayment } from '../../controllers/booking.controller';
import { createBookingSchema, paymentSchema } from '../../validators/bookingSchema';
import { validateRequestBody } from '../../validators';

const bookingRouter = express.Router();

bookingRouter.post('/', validateRequestBody(createBookingSchema), createBooking);
bookingRouter.post('/payments', validateRequestBody(paymentSchema), makePayment);

export default bookingRouter;