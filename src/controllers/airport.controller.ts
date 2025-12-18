import { Request,Response } from "express"
import { StatusCodes } from "http-status-codes";

import { createAirportService, deleteAirportService, getAirportService, getAirportsService, updateAirportService } from "../service/airport.service";


export const createAirportHandler = async(req:Request,res:Response)=>{
    const {name,code,cityId} = req.body;
    const airportName = await createAirportService({name,code,cityId});
     res.status(StatusCodes.CREATED).json({
        success:true,
        message:'Airport Created Successfully',
        data:airportName
    })
}

export const getAirportHandler = async(req:Request,res:Response)=>{
    const airport = await getAirportService(Number(req.params.id));
     res.status(StatusCodes.OK).json({
        success:true,
        message:'City fetched successfully',
        data:airport
    })
}

export const getAllAirportHandler = async(req:Request,res:Response)=>{
    const airports = await getAirportsService();
     res.status(StatusCodes.OK).json({
        success:true,
        message:'Cities fetched successfully',
        data:airports
    })
}

export const updateAirportDetails = async(req:Request,res:Response)=>{
    const {name}= req.body;
    const id =Number(req.params.id)
    const updatedAirport = await updateAirportService({id,name});
     res.status(StatusCodes.OK).json({
        success:true,
        message:'Cities fetched successfully',
        data:updatedAirport
    })
}

export const deleteAirportHandler = async(req:Request,res:Response)=>{
    const airport = await deleteAirportService(Number(req.params.id));
     res.status(StatusCodes.OK).json({
        success:true,
        message:'City fetched successfully',
        data:airport
    })
}
