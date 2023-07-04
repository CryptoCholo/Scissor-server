import express, { Express, Request, Response, NextFunction, json } from "express";
import passport, { use } from 'passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import * as  dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import limiter from './utils/rateLimiter'
import router from "./routes/urlRoutes";
import './database/mongoDB';

// import './config/passport';

const PORT = Number(process.env.PORT);

const app : Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(
    cors({
      origin: [process.env.CLIENT_URL],
    })
);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
  });
  
app.use(limiter)
app.use(router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({ message: err.message });
});
  

// Add your authentication routes  
app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({ hi: "There" });
});


app.listen(PORT, () => {
  console.log(`your application is running on ${process.env.HOST}:${process.env.PORT}`);
});