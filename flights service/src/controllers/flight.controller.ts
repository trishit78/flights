import { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { createFlightService, getAllFlightsService, getFlightService, updateFlightSeatsService } from "../service/flight.service";

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
     res.status(StatusCodes.OK).json({
        success:true,
        message:"Fetched All Flights data",
        data:flights
    })
}


export const getFlights = async(req:Request,res:Response)=>{
    const flights = await getFlightService(Number(req.params.id));
    res.status(StatusCodes.OK).json({
        success:true,
        message:"Fetched Flights data",
        data:flights
    })
}

export const updateFlightSeats:RequestHandler = async(req:Request,res:Response)=>{
    const id =Number(req.params.id);
    const {seats,dec} = req.body;
    
    const flights = await updateFlightSeatsService({id,seats,dec});
    res.status(StatusCodes.OK).json({
        success:true,
        message:"Flight seats updated",
        data:flights
    })
}
