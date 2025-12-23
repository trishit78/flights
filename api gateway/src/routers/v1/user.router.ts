import express from 'express';
import { pingController } from '../../controllers/ping.controller.js';

const userRouter = express.Router();

userRouter.get('/',pingController)

export default userRouter;