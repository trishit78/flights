import express from 'express';
import { pingController } from '../../controllers/ping.controller.js';
import { signUpHandler } from '../../controllers/signup.controller.js';

const userRouter = express.Router();

userRouter.get('/',pingController);

userRouter.post('/signup',signUpHandler);

export default userRouter;