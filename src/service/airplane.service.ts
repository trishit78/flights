import { updateAirplaneDTO } from "../DTO/airplaneDTO";
import { createAirplaneRepo, deleteAirplane, getAirplane, getAllAirplane, updateAirplane } from "../repository/airplane.repository";


export type AirplaneDTO = {
    modelNumber:string,
    capacity:number
}


export const createAirplaneService = async(airplaneData:AirplaneDTO) =>{
    const {modelNumber,capacity} = airplaneData;
    
    const airplane = await createAirplaneRepo({modelNumber,capacity});
    return airplane;
}


export const getAirplaneService = async(airplaneId:number)=>{
    const getAirplaneDetails = await getAirplane(airplaneId);
    
    return getAirplaneDetails;
}


export const getAllAirplaneService = async()=>{
    const airplanes = await getAllAirplane()
    return airplanes
}


export const updateAirplaneService = async(updateAirplaneData:updateAirplaneDTO)=>{
   const airplane = await updateAirplane(updateAirplaneData)
    return airplane
}

export const deleteAirplaneService = async(id:number)=>{
    await deleteAirplane(id)
    return null;
}