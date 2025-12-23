import bcrypt from "bcryptjs";
import type { signUpDTO } from "../DTO/user.DTO.js";
import { signUpRepo } from "../repository/signup.repository.js";

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