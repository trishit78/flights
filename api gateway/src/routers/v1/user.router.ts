import express from 'express';
import { pingController } from '../../controllers/ping.controller.js';
import { signInHandler, signUpHandler } from '../../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.get('/',pingController);

userRouter.post('/signup',signUpHandler);
userRouter.post('/signin',signInHandler);

export default userRouter;