// import { NextFunction, Request, Response } from "express";

// export const attachUserContext = (req:Request, res:Response, next:NextFunction) => {
//   const userId = req.headers['x-user-id'];

//   if (!userId) {
//      res.status(401).json({ message: 'Unauthenticated' });
//     return
//     }

//   req.user = {
//     id: Number(userId)
//   };
//   next();
// };
