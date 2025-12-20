import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { createFlightService } from "../service/flight.service";

export const createFlightHandler = async(req:Request,res:Response)=>{
    const {flightNumber,airplaneId,departureAirportId,arrivalAirportId,arrivalTime,departureTime,price,boardingGate,totalSeats} = req.body;
    const flightName = await createFlightService({flightNumber,airplaneId,departureAirportId,arrivalAirportId,arrivalTime,departureTime,price,boardingGate,totalSeats});
     res.status(StatusCodes.CREATED).json({
        success:true,
        message:'Flight Created Successfully',
        data:flightName
    })
}