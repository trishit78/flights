import express from 'express';
import { pingController } from '../../controllers/ping.controller.js';
import { addRolesToUser, getUserById, signInHandler, signUpHandler } from '../../controllers/user.controller.js';
import { authRequest, checkIsAdmin } from '../../middleware/authRequest.middleware.js';

import { signInSchema, signUpSchema, userByIdSchema } from '../../validators/userSchema.js';
import { validateRequestBody, validateUrlParams } from '../../validators/index.js';


const userRouter = express.Router();

userRouter.get('/',authRequest,pingController);

userRouter.post('/signup',validateRequestBody(signUpSchema),signUpHandler);
userRouter.post('/signin',validateRequestBody(signInSchema),signInHandler);
userRouter.get('/:id',validateUrlParams(userByIdSchema),getUserById);

userRouter.post('/role',authRequest,checkIsAdmin,addRolesToUser);

export default userRouter;