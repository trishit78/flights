import {type Request,type Response} from 'express';
import { addRolesToUserService, getUserByIdService, signInService, signUpService } from '../services/user.service.js';


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

export const signInHandler = async(req:Request,res:Response)=>{
   try {
        const response = await signInService(req.body);
        res.status(200).json({
            success:true,
            message:"User roles changed successfully",
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

export const addRolesToUser = async(req:Request,res:Response)=>{
    try {
    const response = await addRolesToUserService(req.body);
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

export const getUserById = async(req:Request,res:Response)=>{
    try {
         const id = Number(req.params.id)
         if(!id){
            throw new Error('id not found')
         }
         const response = await getUserByIdService(id);
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