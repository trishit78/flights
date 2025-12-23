import { BookingStatus } from "../generated/prisma/enums"

export type BookingDataDTO = {
    flightId:number,
    userId:number,
    noOfSeats:number
}

export type BookingRepoDataDTO = {
    flightId:number,
    userId:number,
    noOfSeats:number,
    totalCost:number
}

export type PaymentDataDTO = {
    totalCost:number,
    userId:number,
    bookingId:number
}

export type UpdateBookingDTO = {
    bookingId:number,
    status:BookingStatus   
}

export type cancelBookingDTO = {
    bookingId:number,
    status:BookingStatus
}