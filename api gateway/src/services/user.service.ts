import bcrypt from "bcryptjs";
import type { signInDTO, signUpDTO } from "../DTO/user.DTO.js";
import { getUserByEmail, signUpRepo } from "../repository/user.repository.js";
import { comparePassword, createToken } from "../utils/auth.js";

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