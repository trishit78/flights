import {type Request,type Response} from 'express';
import { signUpService } from '../services/signup.service.js';


export const signUpHandler = async(req:Request,res:Response)=>{
    try {
        const response = await signUpService(req.body);
        res.status(200).json({
            success:true,
            message:"User successfully signed up",
            data:response            
        });
    } catch (error:unknown) {
        if(error instanceof Error){
            res.status(500).json({
                success: false,
                message: "Internal server error",
                data:error.message
            });
        }
}

}