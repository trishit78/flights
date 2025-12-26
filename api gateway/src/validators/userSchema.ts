import {z} from 'zod';

export const signUpSchema = z.object({
    email: z.string({message: 'Email is required'}).email({message: 'Invalid email format'}),
    password: z.string({message: 'Password is required'}).min(6, {message: 'Password must be at least 6 characters'}),
    name: z.string({message: 'Name is required'})
});

export const signInSchema = z.object({
    email: z.string({message: 'Email is required'}).email({message: 'Invalid email format'}),
    password: z.string({message: 'Password is required'})
});

export const userByIdSchema = z.object({
    id: z.string({message: 'User Id is required'})
});
