import express from 'express';
import { pingController } from '../../controllers/ping.controller.js';
import { addRolesToUser, getUserEmailById, signInHandler, signUpHandler } from '../../controllers/user.controller.js';
import { authRequest, checkIsAdmin } from '../../middleware/authRequest.middleware.js';

const userRouter = express.Router();

userRouter.get('/',authRequest,pingController);

userRouter.post('/signup',signUpHandler);
userRouter.post('/signin',signInHandler);
userRouter.get('/:id',getUserEmailById);

userRouter.post('/role',authRequest,checkIsAdmin,addRolesToUser);

export default userRouter;