import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { createBookingService, makePaymentService } from "../service/booking.service";
import { bookingAttemptsTotal, bookingFailedTotal, bookingSuccessTotal } from "../metrics/bookingMetric";

interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
  };
}

export const createBooking =  async(req:Request,res:Response)=>{
  bookingAttemptsTotal.inc();
  const authReq = req as AuthenticatedRequest;
  if (!authReq.user) {
    bookingFailedTotal.inc({ reason: "AUTH_FAILED" });
      res.status(401).json({
       success: false,
       message: 'Unauthorized'
     });
     return;
  }

  const bookingData = {
    ...req.body,
    userId: authReq.user.id   
  };
  
  const response = await createBookingService(bookingData);
    
  bookingSuccessTotal.inc();
  res.status(StatusCodes.CREATED).json({
        success:true,
        message:"Booking Initiated Successfully",
        data:response
    }) 
}

const inMemDb :Record<string,boolean> = {};
export const makePayment = async (req:Request, res:Response) => {
  const idempotencyKey = req.headers["x-idempotency-key"];

  if (typeof idempotencyKey !== "string") {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "idempotency key missing or invalid"
    });
    return;
  }

  if (inMemDb[idempotencyKey]) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Cannot retry on a successful payment"
    });
    return;
  }


  
  const authReq = req as AuthenticatedRequest;
  if (!authReq.user) {
      res.status(401).json({
       success: false,
       message: 'Unauthorized'
     });
     return;
  }

  const paymentData = {
    ...req.body,
    userId: authReq.user.id   
  };
  const response = await makePaymentService(paymentData);

  inMemDb[idempotencyKey] = true;

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Payment done successfully",
    data: response
  });
};

