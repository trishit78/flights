import { FlightDataDTO, UpdateFlightDTO } from "../DTO/Flight.DTO";
import { prisma } from "../prisma/client";

export const createFlightRepo = async (flightData: FlightDataDTO) => {
  const flight = await prisma.flight.create({
    data: flightData,
  });
  return flight;
};

export const getAllFlightsRepo = async (customFilter: any, sortFilter: any) => {
  console.log("customFilter in repo", customFilter);
  const flight = await prisma.flight.findMany({
    where: customFilter,
    orderBy: sortFilter.length ? sortFilter : undefined,
    include: {
      airplane: true,
      departureAirport: {
        include: {
          city: true,
        },
      },
      arrivalAirport: {
        include: {
          city: true,
        },
      },
    },
  });
  console.log(flight);
  return flight;
};


export const getFlightRepo=async(flightId:number)=>{
  const flight = await prisma.flight.findUnique({
    where:{
      id:flightId
    }
  });
  return flight;
}

export const updateFlightSeatsRepo = async(flightData:UpdateFlightDTO)=>{
  return prisma.$transaction(async(tx)=>{
    const flight = await tx.flight.findUnique({
      where:{
        id:flightData.id
      },
      select:{id:true,totalSeats:true}
    });
    if(!flight){
      throw new Error("Flight not found");
    }
    if(flightData.dec && flight.totalSeats
      < flightData.seats){
        throw new Error("Not Enough seats available")
      }

      const updatedFlight = await tx.flight.update({
        where:
        {
          id:flightData.id
        },
        data:{
          totalSeats:flightData.dec ? { decrement:flightData.seats}: { increment:flightData.seats}
        }
      })
      return updatedFlight;
  }) 

  // const flight = await prisma.flight.update({
  //   where:{
  //     id:flightData.id
  //   },
  //   data:{
  //     totalSeats:flightData.dec ? {decrement:flightData.seats}:{increment:flightData.seats}
  //   }
  // });
  // return flight;
}