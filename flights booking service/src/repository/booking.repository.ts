import { BookingRepoDataDTO, UpdateBookingDTO } from "../DTO/booking.DTO";
import { BookingStatus, Prisma } from "../generated/prisma/client";
import { prisma } from "../prisma/client";


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

export const getOldBookingsRepo = async(timestamp:Date)=>{
    const response = await prisma.bookings.findMany({
        where:{
            createdAt:{
                lt:timestamp
            },
            status:{
                notIn:[BookingStatus.BOOKED,BookingStatus.CANCELLED]
            }
        },
    })
    return response;
}


