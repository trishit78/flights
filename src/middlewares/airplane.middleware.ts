import { NextFunction, Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";



export const validateCreateAirplane : RequestHandler = (req:Request,res:Response,next:NextFunction)=> {
    if(!req.body.modelNumber){
         res.status(StatusCodes.BAD_REQUEST).json(
            {
                success:false,
                error:{
                    name:"Bad Request Error",
                    message:'Something Went Wrong while creating airplane'

                }
            }
        )
        return;
    }
    next();
}


