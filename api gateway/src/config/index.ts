// This file contains all the basic configuration logic for the app server to work
import dotenv from 'dotenv';

type ServerConfig = {
    PORT: number,
    JWT_SECRET:string,
    JWT_EXPIRY:string
    FLIGHT_SERVICE:string,
    BOOKING_SERVICE:string
}

function loadEnv() {
    dotenv.config();
    console.log(`Environment variables loaded`);
}

loadEnv();

export const serverConfig: ServerConfig = {
    PORT: Number(process.env.PORT) || 3001,
    JWT_SECRET:process.env.JWT_SECRET || 'trishit',
    JWT_EXPIRY:process.env.JWT_EXPIRY || '1d',
    FLIGHT_SERVICE:process.env.FLIGHT_SERVICE || 'http://localhost:3000',
    BOOKING_SERVICE:process.env.BOOKING_SERVICE || 'http://localhost:4000'
};