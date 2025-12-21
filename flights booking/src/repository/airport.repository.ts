
import { AirportDTO, updateAirportDTO } from "../DTO/airport.DTO";
import { prisma } from "../prisma/client";
import { BadRequestError } from "../utils/errors/app.error";




export const createAirportRepo = async(airportData:AirportDTO)=>{
    const airport = await prisma.airport.create({
        data:airportData
    })
    return airport;
}

export const getAirport = async(airportId:number)=>{
    const airport =await prisma.airport.findUnique({
        where:{
            id:airportId
        }
    })

    if(!airport){
        throw new BadRequestError("Cannot fetch data of the airport");
    }
    return airport
}


export const getAllAirport = async()=>{
    const airports = await prisma.airport.findMany();
    return airports
}


export const updateAirport = async(updateAirportData:updateAirportDTO)=>{
    const updatedAirport = await prisma.airport.update({
        where:{
            id:updateAirportData.id
        },
        data:{
            name:updateAirportData.name
        }
    });
    return updatedAirport
}

export const deleteAirport = async(id:number)=>{
    await prisma.airport.delete({
        where:{
            id:id
        }
    })
}