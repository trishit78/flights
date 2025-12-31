import { FlightDataDTO, UpdateFlightDTO } from "../DTO/Flight.DTO";
import { searchFlightRequestCounter } from "../metrics/requestCounter";
import {
  createFlightRepo,
  getAllFlightsRepo,
  getFlightRepo,
  updateFlightSeatsRepo,
} from "../repository/flight.repository";

export const createFlightService = async (flightData: FlightDataDTO) => {
  const {
    flightNumber,
    airplaneId,
    departureAirportId,
    arrivalAirportId,
    arrivalTime,
    departureTime,
    price,
    boardingGate,
    totalSeats,
  } = flightData;

  const flight = await createFlightRepo({
    flightNumber,
    airplaneId,
    departureAirportId,
    arrivalAirportId,
    arrivalTime,
    departureTime,
    price,
    boardingGate,
    totalSeats,
  });
  return flight;
};

export const getAllFlightsService = async (query: any) => {
  console.log(query)
      const hasPrice = Boolean(query.price);
  const hasDate = Boolean(query.tripdate);
  const hasTrips = Boolean(query.trips);
  
      searchFlightRequestCounter.inc({
        has_price:String(hasPrice),
        has_date:String(hasDate),
        has_trips:String(hasTrips)
      })
  let customFilter: any = {};
  let sortFilter: any = [];
  if (query.trips) {
    const [departureAirportId, arrivalAirportId] = query.trips.split("-");
    
     if (!departureAirportId || !arrivalAirportId) {
        throw new Error("Both departure and arrival airports are required");
    }

    if (departureAirportId === arrivalAirportId) {
        throw new Error("Departure and arrival airports cannot be the same");
    }

    customFilter.departureAirportId = departureAirportId;
    customFilter.arrivalAirportId = arrivalAirportId;
  }

  if (query.price) {
    const [minPrice, maxPrice] = query.price.split("-").map(Number);

    customFilter.price = {
      gte: minPrice,
      lte: maxPrice ?? 20000,
    };
  }

  if (query.travellers) {
    const travellerCount = Number(query.travellers);

    customFilter.totalSeats = {
      gte: travellerCount,
    };
  }

  if (query.tripdate) {
    const startOfDay = new Date(`${query.tripdate}T00:00:00.000Z`);
    const endOfDay = new Date(`${query.tripdate}T23:59:59.999Z`);
    customFilter.departureTime = {
      gte: startOfDay,
      lte: endOfDay,
    };
  }

  if (query.sort) {
    sortFilter = query.sort.split(",").map((param: string) => {
      const [field, order] = param.split("_");

      return {
        [field]: order === "desc" ? "desc" : "asc",
      };
    });
  }
  try {
    const flights = await getAllFlightsRepo(customFilter, sortFilter);
    return flights;
  } catch (error: any) {
    console.log(error.message);
    throw new Error("Error in get queried flights service layer");
  }
};


export const getFlightService=async(flightId:number)=>{
    const flight = await getFlightRepo(flightId);
    return flight;
}

export const updateFlightSeatsService = async(flightData:UpdateFlightDTO)=>{
  const flight = await updateFlightSeatsRepo(flightData);
  return flight;
}