import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { createBookingService } from "../service/booking.service";

export const createBooking =  async(req:Request,res:Response)=>{
    
    const response = await createBookingService(req.body);
    res.status(StatusCodes.CREATED).json({
        success:true,
        message:"Booking Initiated Successfully",
        data:response
    }) 
}

