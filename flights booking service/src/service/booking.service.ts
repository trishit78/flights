import axios from "axios";
import { BookingDataDTO } from "../DTO/booking.DTO";
import { serverConfig } from "../config";
import { bookingRepo } from "../repository/booking.repository";
import { prisma } from "../prisma/client";


export const createBookingService = async(bookingData:BookingDataDTO)=>{

    const flightResponse = await axios.get(`${serverConfig.FLIGHT_SERVICE}/api/v1/flight/${bookingData.flightId}`);
    const flight =flightResponse.data.data;

    if(bookingData.noOfSeats > flight.totalSeats){
        throw new Error("Not enough seats avaiable")
    }
    const flightId = bookingData.flightId;
    const userId = bookingData.userId;
    const noOfSeats = bookingData.noOfSeats;
    const price = flight.price;
    const totalCost= noOfSeats*price;

    // const booking  = await bookingRepo({flightId,userId,noOfSeats,totalCost});
    
    const booking  = await prisma.$transaction(async(tx)=>{
        return bookingRepo(tx,
            {flightId,userId,noOfSeats,totalCost}
        )
    })

     try {
        await axios.patch(`${serverConfig.FLIGHT_SERVICE}/api/v1/flight/${bookingData.flightId}/seats`,
            {
                seats:bookingData.noOfSeats,
                dec:true
            }
        )
     } catch (error) {
        throw new Error("Booking Failed,seats not reserved");
     };
     return booking;
}