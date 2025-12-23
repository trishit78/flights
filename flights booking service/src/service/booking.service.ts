import axios from "axios";
import { BookingDataDTO, PaymentDataDTO } from "../DTO/booking.DTO";
import { serverConfig } from "../config";
import { bookingRepo, getBookingDetails, updateBookingDetails } from "../repository/booking.repository";
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



export const makePaymentService = async(paymentData:PaymentDataDTO)=>{
    const bookingDetails = await prisma.$transaction(async(tx)=>{
        return getBookingDetails(tx,paymentData.bookingId);
    });
    if(bookingDetails?.status == "CANCELLED"){
        throw new Error("The booking has expired");
    }
    if (!bookingDetails?.createdAt) {
  throw new Error("bookingDetails or createdAt missing");
}
     const bookingTime:any = new Date(bookingDetails.createdAt)
     const currentTime :any= new Date()
    if(currentTime - bookingTime>300000)   {
        await prisma.$transaction(async(tx)=>{
        return updateBookingDetails(tx,paymentData.bookingId);
    });
    throw new Error('The booking has expired');
    }

    if(bookingDetails.totalCost!=paymentData.totalCost){
        throw new Error('The amount of payment does not match')
    }

    if(bookingDetails.userId != paymentData.userId) {
            throw new Error('The user corresponding to the booking doesnt match');
        }

        await prisma.$transaction(async(tx)=>{
        return updateBookingDetails(tx,paymentData.bookingId)
    });

}



// const booking = await prisma.$transaction(async (tx) => {
//   return createBookingRepo(tx, {
//     flightId: data.flightId,
//     userId: data.userId,
//     noOfSeats: data.noOfSeats,
//     totalCost,
//     status: "INITIATED"
//   });
// });