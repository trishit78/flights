import { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { createFlightService, getAllFlightsService } from "../service/flight.service";

export const createFlightHandler = async(req:Request,res:Response)=>{
    const {flightNumber,airplaneId,departureAirportId,arrivalAirportId,arrivalTime,departureTime,price,boardingGate,totalSeats} = req.body;
    const flightName = await createFlightService({flightNumber,airplaneId,departureAirportId,arrivalAirportId,arrivalTime,departureTime,price,boardingGate,totalSeats});
     res.status(StatusCodes.CREATED).json({
        success:true,
        message:'Flight Created Successfully',
        data:flightName
    })
}


export const getAllFlights:RequestHandler = async(req:Request,res:Response)=>{
    const flights = await getAllFlightsService(req.query);
     res.status(StatusCodes.CREATED).json({
        success:true,
        message:"Fetched Flight data",
        data:flights
    })
}
