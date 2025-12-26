import {z} from 'zod';

export const createBookingSchema = z.object({
    flightId: z.number({message: 'Flight Id is required'}),
    noOfSeats: z.number({message: 'Number of seats is required'}).min(1, {message: 'At least 1 seat required'})
});

export const paymentSchema = z.object({
    totalCost: z.number({message: 'Total cost is required'}),
    bookingId: z.number({message: 'Booking Id is required'})
});
