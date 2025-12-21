import { FlightDataDTO } from "../DTO/Flight.DTO";
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
