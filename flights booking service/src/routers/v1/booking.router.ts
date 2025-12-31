import express from 'express';
import { createBooking, makePayment } from '../../controllers/booking.controller';
import { createBookingSchema, paymentSchema } from '../../validators/bookingSchema';
import { validateRequestBody } from '../../validators';
import { metricMiddleware } from '../../middlewares/metrics.middleware';

const bookingRouter = express.Router();
bookingRouter.use(metricMiddleware);
bookingRouter.post('/', validateRequestBody(createBookingSchema), createBooking);
bookingRouter.post('/payments', validateRequestBody(paymentSchema), makePayment);

export default bookingRouter;