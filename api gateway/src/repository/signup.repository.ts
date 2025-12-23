import type { signUpDTO } from "../DTO/user.DTO.js";
import { prisma } from "../prisma/client.js";

export const signUpRepo = async(signUpData:signUpDTO)=>{
   try {
        const user = await prisma.user.create({
        data:signUpData
    })
    return user;       
    } catch (error) {
        throw new Error('Error occured in sign up repo')
    }

}