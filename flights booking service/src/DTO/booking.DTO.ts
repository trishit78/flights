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

