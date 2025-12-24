import bcrypt from "bcryptjs"
import type { InputDataDTO } from "../DTO/user.DTO.js";
import jwt from 'jsonwebtoken'
import { serverConfig } from "../config/index.js";
export const comparePassword = (plainPassword:string,encryptedPassword:string)=>{
    try {
        return bcrypt.compare(plainPassword,encryptedPassword);
    } catch (error) {
        throw error;
    }
}

export const createToken = (input:InputDataDTO)=>{
    try {
        return jwt.sign(input,serverConfig.JWT_SECRET,{expiresIn:serverConfig.JWT_EXPIRY});
    } catch (error) {
        throw error;   
    }
}