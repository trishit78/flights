import {z} from 'zod';

export const createFlightSchema = z.object({
    flightNumber: z.string({message: 'Flight Number is required'}),
    airplaneId: z.number({message: 'Airplane Id is required'}),
    departureAirportId: z.string({message: 'Departure Airport Code is required'}),
    arrivalAirportId: z.string({message: 'Arrival Airport Code is required'}),
    arrivalTime: z.string({message: 'Arrival Time is required'}),
    departureTime: z.string({message: 'Departure Time is required'}),
    price: z.number({message: 'Price must be a number'}),
    boardingGate: z.string().optional(),
    totalSeats: z.number({message: 'Total seats must be a number'}).optional()
});

export const updateFlightSeatsSchema = z.object({
    seats: z.number({message: 'Seats must be a number'}),
    dec: z.boolean({message: 'Dec (decrease) must be a boolean'})
});

export const flightByIdSchema = z.object({
    id: z.string({message: 'Flight Id is required'})
});
