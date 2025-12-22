export type FlightDataDTO={
 flightNumber: string,
 airplaneId: number,
 departureAirportId :string,
 arrivalAirportId:string,
 arrivalTime:Date
 departureTime : Date,
 price:number,
 boardingGate:string,
 totalSeats:number   
}

export type UpdateFlightDTO = {
    id:number,
    seats:number,
    dec:boolean
}