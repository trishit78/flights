import type { signInDTO, signUpDTO } from "../DTO/user.DTO.js";
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

export const getUserByEmail = async(signInData:signInDTO)=>{
    try {
        const user = await prisma.user.findUnique({
            where:{
                email:signInData.email
            }
        })
        return user;
    } catch (error) {
        throw new Error('Error occured in sign in repo')
    }
}

export const getUserById = async(userId:number)=>{
    try {
        const user = await prisma.user.findUnique({
            where:{
                id:userId
            }
        })
        return user
     } catch (error) {
        throw new Error('Error occured in sign in repo')
    }
}