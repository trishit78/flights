import bcrypt from "bcryptjs";
import type { signInDTO, signUpDTO } from "../DTO/user.DTO.js";
import { getUserByEmail, getUserById, signUpRepo } from "../repository/user.repository.js";
import { comparePassword, createToken } from "../utils/auth.js";
import jwt from 'jsonwebtoken';
import { serverConfig } from "../config/index.js";

export const signUpService = async(signUpData:signUpDTO)=>{
    try {
        const userPassword = signUpData.password;
        const hashedPassword = await bcrypt.hash(userPassword,10);
        signUpData.password=hashedPassword
        const response = await signUpRepo(signUpData);
        return response;
     } catch (error:unknown) {
        throw new Error('Error occured in signup service');
}
}

export const signInService= async(signInData:signInDTO)=>{
    try {

        const user = await getUserByEmail(signInData);
        if(!user){
            throw new Error('no user found in this email');
        }

        const passwordMatch = comparePassword(signInData.password,user.password);
        if(!passwordMatch){
            throw new Error('Wrong Password');
        }
        const jwt = createToken({id:user.id,email:user.email});
        return {user,jwt};

    } catch (error:unknown) {
        throw new Error('Error occured in signup service');
}
}


export const isAuthenticated = async(token:string)=>{
    try {
        if(!token){
            throw new Error('Missing JWT Token');
        }
        const response = jwt.verify(token,serverConfig.JWT_SECRET);

        if (
  typeof response !== 'object' ||
  !('id' in response)
) {
  throw new Error('Invalid token payload');
}
        const user = await getUserById(response.id);
        if(!user){
            throw new Error('No user found');

        }
        return user.id;
    } catch (error:unknown) {
        if(error instanceof Error){
            if(error.name == 'JsonWebTokenError'){
                throw new Error('Invalid JWT Token');
            }
             if(error.name == 'TokenExpiredError') {
            throw new Error('JWT token expired');
        }
            throw error;
        }
        throw new Error('Internal Server Error in auth middleware');
    }
}