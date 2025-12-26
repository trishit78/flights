import {z} from 'zod';

export const airplaneSchema = z.object({
    modelNumber:z.string({message:'Airplane model no must be present'}),
   capacity:z.number({message:'capacity must be defined'}).max(200,{message:'maximum 200 seats can be in an airplane'})
})

export const airplaneByIdSchema= z.object({
    id:z.string({message:'airplane id must be present'})
})

