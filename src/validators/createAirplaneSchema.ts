import {z} from 'zod';

export const createAirplaneSchema = z.object({
    modelNumber:z.number({message:'Airplane model no must be present'}),
   
})