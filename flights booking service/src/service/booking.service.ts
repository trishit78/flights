import axios from "axios";
import { BookingDataDTO, PaymentDataDTO } from "../DTO/booking.DTO";
import { serverConfig } from "../config";
import { bookingRepo, getBookingDetails, getOldBookingsRepo, updateBookingDetails } from "../repository/booking.repository";
import { prisma } from "../prisma/client";
import { addEmailToQueue } from "../producer/mailer.producer";
import { bookingReservationExpiredTotal } from "../metrics/bookingMetric";



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
     const bookingId = paymentData.bookingId
    if(currentTime - bookingTime>300000)   {
        await cancelBooking(paymentData.bookingId)
    };


    if(bookingDetails.totalCost!=paymentData.totalCost){
        throw new Error('The amount of payment does not match')
    }

    if(bookingDetails.userId != paymentData.userId) {
            throw new Error('The user corresponding to the booking doesnt match');
        }

        await prisma.$transaction(async(tx)=>{
        return  updateBookingDetails(tx,{bookingId,status:"BOOKED"})
    });
    
    //here add mail    
   
         const userData = await axios.get(
  `${serverConfig.API_GATEWAY}/api/v1/${paymentData.userId}`
);

        addEmailToQueue({
            to: userData.data.data.email,
            subject: "test booking",
            templateId: "welcome",
            params: {
                name: userData.data.data.name,
                appName: "flight booking",
            }
        })
    

}


export const cancelBooking = async(bookingId:number)=>{
    const bookingDetails = await prisma.$transaction(async(tx)=>{
        return getBookingDetails(tx,bookingId)
    });
    
    if(bookingDetails?.status=="CANCELLED"){
        return true;
    }

    await axios.patch(`${serverConfig.FLIGHT_SERVICE}/api/v1/flight/${bookingDetails?.flightId}/seats`,{
        seats:bookingDetails?.noOfSeats,
        dec:false
    });
    await prisma.$transaction(async(tx)=>{
        return updateBookingDetails(tx,{bookingId,status:"CANCELLED"})
         });
}



export const cancelOldBookings =async ()=>{
    const time = new Date(Date.now()-1000*600);  // 10 min to make the payment
    const bookings = await getOldBookingsRepo(time);
   
    for(const booking of bookings){
        try {
             await axios.patch(`${serverConfig.FLIGHT_SERVICE}/api/v1/flight/${booking?.flightId}/seats`,{
                seats:booking?.noOfSeats,
                dec:false
        });
            const bookingId = booking.id;
            
            bookingReservationExpiredTotal.inc();
            await prisma.$transaction(async(tx)=>{
        return updateBookingDetails(tx,{bookingId,status:"CANCELLED"})
         });

        } catch (error) {
            throw new Error('error occured in cancel old bookings')
        }
    }
    
return true;
    
}


//   return createBookingRepo(tx, {
//     flightId: data.flightId,
//     userId: data.userId,
//     noOfSeats: data.noOfSeats,
//     totalCost,
//     status: "INITIATED"
//   });
// });