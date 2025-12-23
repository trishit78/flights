import express from 'express';
import userRouter from './v1/user.router.js';


const apiRouter = express.Router();

apiRouter.use('/v1',userRouter);

export default apiRouter;