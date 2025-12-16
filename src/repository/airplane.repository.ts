
import { prisma } from "../prisma/client";


export type AirplaneDTO = {
    modelNumber:string,
    capacity:number
}

export const airplaneRepo = async(airplaneData:AirplaneDTO)=>{
    const booking = await prisma.airplane.create({
        data:airplaneData
    })
    return booking;

}
