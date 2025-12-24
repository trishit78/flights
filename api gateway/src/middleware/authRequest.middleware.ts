import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { isAuthenticated } from "../services/user.service.js";

export const authRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(StatusCodes.UNAUTHORIZED).json({
            success:false,
            message:'Invalid auth header'
        })
    }
    const token = authHeader.split(" ")[1];
    // const token = req.headers["x-access-token"];

    if (typeof token !== "string") {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Missing or invalid access token",
      });
    }
    const response = await isAuthenticated(token);
if (!response) {
  return res.status(StatusCodes.UNAUTHORIZED).json({
    success: false,
    message: 'Unauthorized'
  });
}
    req.user = response;
    next();

} catch (error) {
    if (error instanceof Error)
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: error.message,
      });
  }
};
