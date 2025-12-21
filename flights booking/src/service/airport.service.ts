
import { AirportDTO, updateAirportDTO } from "../DTO/airport.DTO";
import { createAirportRepo, deleteAirport, getAirport, getAllAirport, updateAirport } from "../repository/airport.repository";


export const createAirportService = async(airportData:AirportDTO) =>{
    const {name,code,cityId} = airportData;
    
    const airport = await createAirportRepo({name,code,cityId});
    return airport;
}


export const getAirportService = async(airportId:number)=>{
    const getAirportDetails = await getAirport(airportId);
    
    return getAirportDetails;
}


export const getAirportsService = async()=>{
    const airports = await getAllAirport()
    return airports
}


export const updateAirportService = async(updateAirportData:updateAirportDTO)=>{
   const airport = await updateAirport(updateAirportData)
    return airport
}

export const deleteAirportService = async(id:number)=>{
    await deleteAirport(id)
    return null;
}