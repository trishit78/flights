import { Request, Response } from "express";
import { createAirplaneService, deleteAirplaneService, getAirplaneService, getAllAirplaneService, updateAirplaneService } from "../service/airplane.service";

export const createAirplaneHandler = async(req:Request,res:Response)=>{
    const {modelNumber,capacity} = req.body;
    const airplane = await createAirplaneService({modelNumber,capacity});
    res.status(200).json({
        success:true,
        message:"Successfully created an airplane",
        data:airplane       
    })

}


export const getAllAirplaneHandler = async(req:Request,res:Response)=>{
    const airplane = await getAllAirplaneService();
    res.status(200).json({
        success:true,
        data:airplane
    })
}


export const getAirplaneHandler = async(req:Request,res:Response)=>{
    const id = Number(req.params.id)
    
    const airplane = await getAirplaneService(id);
    res.status(200).json({
        success:true,
        data:airplane
    })
}


export const updateAirplaneHandler = async(req:Request,res:Response)=>{
    const {airplaneId,capacity} = req.body;    
    const airplane = await updateAirplaneService({airplaneId,capacity});
    res.status(200).json({
        success:true,
        data:airplane
    })
}
export const deleteAirplaneHandler = async(req:Request,res:Response)=>{
    
    await deleteAirplaneService(Number(req.params.id));
    res.status(200).json({
        success:true,
        data:'Deleted'
    })
}