import { AirplaneDTO, updateAirplaneDTO } from "../DTO/airplaneDTO";
import { prisma } from "../prisma/client";
import { BadRequestError } from "../utils/errors/app.error";




export const createAirplaneRepo = async(airplaneData:AirplaneDTO)=>{
    const booking = await prisma.airplane.create({
        data:airplaneData
    })
    return booking;
}

export const getAirplane = async(airplaneId:number)=>{
    const airplane =await prisma.airplane.findUnique({
        where:{
            id:airplaneId
        }
    })

    if(!airplane){
        throw new BadRequestError("Cannot fetch data of the airplanes");
    }
    return airplane
}


export const getAllAirplane = async()=>{
    const airplanes = await prisma.airplane.findMany();
    return airplanes
}


export const updateAirplane = async(updateAirplaneData:updateAirplaneDTO)=>{
    const updatedAirplane = await prisma.airplane.update({
        where:{
            id:updateAirplaneData.airplaneId
        },
        data:{
            capacity:updateAirplaneData.capacity
        }
    });
    return updatedAirplane
}

export const deleteAirplane = async(id:number)=>{
    await prisma.airplane.delete({
        where:{
            id:id
        }
    })
}