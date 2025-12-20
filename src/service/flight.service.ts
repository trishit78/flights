import { FlightDataDTO } from "../DTO/Flight.DTO";
import { createFlightRepo } from "../repository/flight.repository";

export const createFlightService = async(flightData:FlightDataDTO) =>{
    const {flightNumber,airplaneId,departureAirportId,arrivalAirportId,arrivalTime,departureTime,price,boardingGate,totalSeats} = flightData;
    
    const flight = await createFlightRepo({flightNumber,airplaneId,departureAirportId,arrivalAirportId,arrivalTime,departureTime,price,boardingGate,totalSeats});
    return flight;
}
