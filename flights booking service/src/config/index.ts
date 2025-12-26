// This file contains all the basic configuration logic for the app server to work
import dotenv from 'dotenv';

type ServerConfig = {
    PORT: number,
    FLIGHT_SERVICE:string,
    API_GATEWAY:string,
    REDIS_PORT:number,
    REDIS_HOST:string,
    JWT_SECRET:string
}

function loadEnv() {
    dotenv.config();
    console.log(`Environment variables loaded`);
}

loadEnv();

export const serverConfig: ServerConfig = {
    PORT: Number(process.env.PORT) || 3001,
    FLIGHT_SERVICE:process.env.FLIGHT_SERVICE || "http://localhost:3000",
    API_GATEWAY:process.env.API_GATEWAY || "http://localhost:5000",
    REDIS_PORT:Number(process.env.REDIS_PORT) || 6379,
    REDIS_HOST:process.env.REDIS_HOST || 'localhost',
    JWT_SECRET:process.env.JWT_SECRET || 'trishit'
};