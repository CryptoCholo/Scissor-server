import { RequestHandler,  Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import passport from 'passport';
import { IUser } from '../models/User';
dotenv.config();

export const signup: RequestHandler = async (req: Request, res: Response, next : NextFunction ) => {
  passport.authenticate("signup", (err: Error, user: IUser, info: String) => {
    if (err) { return next(err); }

    if (!user) {
        return res.status(400).json({ message : info });
    }

    user.password = undefined;

    return res.status(201).json({
      message: info,
      user: user,
    });
})(req, res, next);
};


export const login: RequestHandler = (req : Request, res : Response, next : NextFunction) => {
  passport.authenticate("login", (err: Error, user: IUser, info: String) => {
    if (err) { return next(err); }

    if (!user) {
        return res.status(404).redirect("/login");
    }
    req.login(user, { session: false },
      async (error) => {
       
          if (error) return res.status(400).json(error)

          const body = {id: user._id, username: user.username };
         
          const token = jwt.sign({ user: body }, process.env.JWT_SECRET, { expiresIn: '1h' });
              
          return res.status(200).json({info, token});
      }
  );
})(req, res, next);
   
}