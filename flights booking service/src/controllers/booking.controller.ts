import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { createBookingService, makePaymentService } from "../service/booking.service";

export const createBooking =  async(req:Request,res:Response)=>{
// if (!req.user) {
//      res.status(401).json({
//       success: false,
//       message: 'Unauthorized'
//     });
//   }

//   const bookingData = {
//     ...req.body,
//     userId: (req.user as any).id   
//   };

    const response = await createBookingService(req.body);
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

  const response = await makePaymentService(req.body);

  inMemDb[idempotencyKey] = true;

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Payment done successfully",
    data: response
  });
};

