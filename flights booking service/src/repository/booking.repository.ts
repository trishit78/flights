import { BookingRepoDataDTO } from "../DTO/booking.DTO";
import { Prisma } from "../generated/prisma/client";


export const bookingRepo = async(tx:Prisma.TransactionClient,bookingData:BookingRepoDataDTO)=>{
    const booking = await tx.bookings.create({
        data:bookingData
    });
    return booking;
}