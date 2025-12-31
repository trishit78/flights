import { NextFunction, Request, Response } from "express";
import { requestCounter } from "../metrics/requestCounter";
import { activeRequest } from "../metrics/activeRequest";
import { httpRequestDuration } from "../metrics/histogram";

export const metricMiddleware = (req:Request,res:Response,next:NextFunction)=>{
    const startTime = Date.now();
    activeRequest.inc()
    res.on('finish',()=>{
        const endTime = Date.now();
        const duration  = endTime-startTime;
        console.log(`Request took ${duration}ms`);
        requestCounter.inc({
            method:req.method,
            route:req.route ? req.route.path :req.path,
            status_code:res.statusCode
        })
        httpRequestDuration.observe({
            method:req.method,
            route:req.route ? req.route.path:req.path,
            status_code:res.statusCode
        },duration)
        activeRequest.dec()
    })
    next()
}