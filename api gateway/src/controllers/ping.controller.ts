import {type Request,type Response } from "express";


export const pingController = async(_req:Request,res:Response)=>{
    console.log('ping called');
    res.status(200).json({
        success:true,
        message:'ping'
    })
}