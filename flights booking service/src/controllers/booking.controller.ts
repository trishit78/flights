import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { createBookingService, makePaymentService } from "../service/booking.service";

export const createBooking =  async(req:Request,res:Response)=>{
    const response = await createBookingService(req.body);
    res.status(StatusCodes.CREATED).json({
        success:true,
        message:"Booking Initiated Successfully",
        data:response
    }) 
}

export const makePayment = async(req:Request,res:Response)=>{
    const response = await makePaymentService(req.body);
    res.status(StatusCodes.OK).json({
        success:true,
        message:"Payment done successfully",
        data:response
    })
}