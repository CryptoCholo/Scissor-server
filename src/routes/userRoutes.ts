import  express from 'express'; 
import passport from 'passport';
import { IUser } from '../models/User';
import { NextFunction, Request, Response } from 'express';
import   * as AuthController  from '../controllers/userController';
import { signUpValidator, loginValidator } from '../utils/userValidator';


const authRouter = express.Router();


authRouter.post('/signup',  signUpValidator, AuthController.signup)  

authRouter.post('/login',  loginValidator, AuthController.login)  


export default authRouter;