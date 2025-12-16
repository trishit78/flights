import { Request, Response } from "express";
import { airplaneService } from "../service/airplane.service";

export const createAirplaneHandler = async(req:Request,res:Response)=>{
    const {modelNumber,capacity} = req.body;
    const airplane = await airplaneService({modelNumber,capacity});
    res.status(200).json({
        success:true,
        data:airplane       
    })

}

