import * as dotenv from 'dotenv';
dotenv.config();

/* eslint-disable no-undef */
import  passport from 'passport';
import { Strategy as localStrategy } from 'passport-local';
import { User, IUser } from '../models/User';
import { Strategy as JWTstrategy } from 'passport-jwt';
import { ExtractJwt as ExtractJWT} from 'passport-jwt';

passport.use(
  new JWTstrategy(
      {
          secretOrKey: process.env.JWT_SECRET,
          jwtFromRequest:ExtractJWT.fromAuthHeaderAsBearerToken() 
      },
      async (token, done) => {
          try {
          
          const id = token.user.id
          const user : IUser = await User.findById(id);

          if (!user) {
              return done(null, false, { message: 'User not found' });
          }
          user.password = undefined;
          
          return done(null, user, { message: 'Success' });

          } catch (error) {
            console.log(error)
              done(error);
          }
      }   
  )
);



passport.use(
  'signup',
  new localStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req,username, password, done) => {
      
      let info = req.body
      try {
        if (!info.password === info.cpassword) {
          return done(null, false, { message: 'Password confirmation does not match'});
      }
        const userExists  : IUser = await User.findOne({ username });
       
        if (!userExists) {

          const user  : IUser = await User.create({fullname : info.fullname, username, password });

          return done(null, user, { message: 'User created successfully'});
        }

        return done(null, false, {message: 'User already exists'});
      } catch (error) {
          console.log("error")
          done(error);
      }
    }
  )
);



passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, username, password, done) => {
      try {
        const user : IUser = await User.findOne({ username });
          

          if (!user) {
            return done(null, false, { message: 'User not found' });
          }
          
          const validate : Boolean = await user.isValidPassword(password);
          
          if (!validate) {
            return done(null, false, { message: 'Wrong Password' });
          }
          user.password = undefined;


        return done(null, user, { message: 'Logged in Successfully' });
      } catch (error) {
        return done(error);
      }
    }
  )
);
