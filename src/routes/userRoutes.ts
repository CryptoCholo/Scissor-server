import  express from 'express'; 
import passport from 'passport';
import { IUser } from '../models/User';
import { NextFunction, Request, Response } from 'express';


import   * as AuthController  from '../controllers/userController';
// import { signUpValidator, loginValidator } from '../validators/user.validator.js';

const authRouter = express.Router();

authRouter.post('/signup', passport.authenticate('signup', { session: false }), AuthController.signup);
  

authRouter.post('/login', async (req, res, next) => passport.authenticate('login', (err : string, user: IUser, info: string) => {
    AuthController.login(req, res, { err, user, info})
})(req, res, next))

export default authRouter;