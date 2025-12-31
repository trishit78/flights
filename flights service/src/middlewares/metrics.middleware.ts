import { NextFunction, Request, Response } from "express";
import { requestCounter } from "../metrics/requestCounter";
import { httpRequestDurationinMS } from "../metrics/histogram";
import { activeRequest } from "../metrics/activeRequest";

export const metricsMiddleware = async(req:Request,res:Response,next:NextFunction)=>{
    const startTime = Date.now();
    activeRequest.inc()
    res.on('finish',()=>{
        const endTime = Date.now();
        const duration = endTime-startTime;
        console.log(`request took ${duration}ms`);
          requestCounter.inc({
            method:req.method,
            route:req.route ? req.route.path : req.path,
            status_code:res.statusCode
          });
          httpRequestDurationinMS.observe({
            method:req.method,
            route: req.route? req.route.path:req.path,
            status_code:res.statusCode
          },duration)
          activeRequest.dec()
        })
    next()

}