import { FlightDataDTO } from "../DTO/Flight.DTO";
import { prisma } from "../prisma/client";

export const createFlightRepo = async(flightData:FlightDataDTO)=>{
    const flight = await prisma.flight.create({
        data:flightData
    });
    return flight;
}