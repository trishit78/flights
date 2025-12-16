import { airplaneRepo } from "../repository/airplane.repository";


export type AirplaneDTO = {
    modelNumber:string,
    capacity:number
}


export const airplaneService = async(airplaneData:AirplaneDTO) =>{
    const {modelNumber,capacity} = airplaneData;
    
    const airplane = await airplaneRepo({modelNumber,capacity});
    return airplane;
}