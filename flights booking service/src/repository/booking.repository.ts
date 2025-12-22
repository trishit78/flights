import { BookingRepoDataDTO } from "../DTO/booking.DTO";
import { prisma } from "../prisma/client";

export const bookingRepo = async(bookingData:BookingRepoDataDTO)=>{
    const booking = await prisma.bookings.create({
        data:bookingData
    });
    return booking;
}