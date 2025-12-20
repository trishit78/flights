import { FlightDataDTO } from "../DTO/Flight.DTO";
import { prisma } from "../prisma/client";

export const createFlightRepo = async(flightData:FlightDataDTO)=>{
    const flight = await prisma.flight.create({
        data:flightData
    });
    return flight;
}

export const getAllFlightsRepo = async(customFilter:any,sortFilter:any)=>{
    const flight = await prisma.flight.findMany({
        where:customFilter,
        orderBy:sortFilter.length ? sortFilter : undefined
    });
    return flight;
}