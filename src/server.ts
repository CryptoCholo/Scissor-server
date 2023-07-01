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




// Import your user model and passport strategies
import  User  from './models/User';
// import './config/passport';

const PORT = Number(process.env.PORT);


const app : Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(
    cors({
      origin: [process.env.CLIENT_URL!, "http://localhost:5173"],
    })
);
app.use(limiter)
app.use(passport.initialize());
app.use(passport.session());
app.use(router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({ message: err.message });
});
  

// Add your authentication routes  
app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({ hi: "There" });
});


// if (process.env.NODE_ENV !== 'test') {
app.listen(PORT, () => {
  console.log(`your application is running on ${process.env.HOST}:${process.env.PORT}`);
});
//   } else {
//     module.exports = app;
// }