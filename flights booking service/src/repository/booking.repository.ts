import { BookingRepoDataDTO, UpdateBookingDTO } from "../DTO/booking.DTO";
import { Prisma } from "../generated/prisma/client";


export const bookingRepo = async(tx:Prisma.TransactionClient,bookingData:BookingRepoDataDTO)=>{
    const booking = await tx.bookings.create({
        data:bookingData
    });
    return booking;
}

export const getBookingDetails = async(tx:Prisma.TransactionClient,bookingId:number)=>{
  console.log('bookingId',bookingId)
  
    return tx.bookings.findUnique({
        where:{
            id:bookingId
        }
    })
}

export const updateBookingDetails = async(tx:Prisma.TransactionClient,updateBookingData:UpdateBookingDTO)=>{
    return tx.bookings.update({
        where:{
            id:updateBookingData.bookingId
        },
        data:{
            status:updateBookingData.status

        }
    })
}




// export const createBookingRepo = async (
//   tx: Prisma.TransactionClient,
//   data: Prisma.BookingCreateInput
// ) => {
//   return tx.booking.create({ data });
// };