import { Request,Response } from "express"
import { StatusCodes } from "http-status-codes";
import { createCityService, deleteCityService, getCitiesService, getCityService, updateCityService } from "../service/city.service";


export const createCityHandler = async(req:Request,res:Response)=>{
    const {city} = req.body;
    const cityName = await createCityService(city);
     res.status(StatusCodes.CREATED).json({
        success:true,
        message:'City Created Successfully',
        data:cityName
    })
}

export const getCityHandler = async(req:Request,res:Response)=>{
    const city = await getCityService(Number(req.params.id));
     res.status(StatusCodes.OK).json({
        success:true,
        message:'City fetched successfully',
        data:city
    })
}

export const getAllCitiesHandler = async(req:Request,res:Response)=>{
    const cities = await getCitiesService();
     res.status(StatusCodes.OK).json({
        success:true,
        message:'Cities fetched successfully',
        data:cities
    })
}

export const updateCityDetails = async(req:Request,res:Response)=>{
    const {name}= req.body;
    const id =Number(req.params.id)
    const updatedCity = await updateCityService({id,name});
     res.status(StatusCodes.OK).json({
        success:true,
        message:'Cities fetched successfully',
        data:updatedCity
    })
}

export const deleteCityHandler = async(req:Request,res:Response)=>{
    const city = await deleteCityService(Number(req.params.id));
     res.status(StatusCodes.OK).json({
        success:true,
        message:'City fetched successfully',
        data:city
    })
}
