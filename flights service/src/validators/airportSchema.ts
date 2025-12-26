import {z} from 'zod';

export const airportSchema = z.object({
    name: z.string({message: 'Airport name is required'}),
    code: z.string({message: 'Airport code is required'}),
    cityId: z.number({message: 'City Id is required'}),
    address: z.string().optional()
});

export const airportByIdSchema = z.object({
    id: z.string({message: 'Airport id is required'})
})

export const updateAirportSchema = z.object({
    name: z.string({message: 'Airport name is required'}).optional(),
    code: z.string({message: 'Airport code is required'}).optional(),
    cityId: z.number({message: 'City Id is required'}).optional(),
    address: z.string().optional()
})
