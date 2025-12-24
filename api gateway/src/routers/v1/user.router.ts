import express from 'express';
import { pingController } from '../../controllers/ping.controller.js';
import { signInHandler, signUpHandler } from '../../controllers/user.controller.js';
import { authRequest } from '../../middleware/authRequest.middleware.js';

const userRouter = express.Router();

userRouter.get('/',authRequest,pingController);

userRouter.post('/signup',signUpHandler);
userRouter.post('/signin',signInHandler);

export default userRouter;