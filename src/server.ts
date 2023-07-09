import express, { Express, Request, Response, NextFunction} from "express";
import passport from 'passport';
import cookieParser from 'cookie-parser';
import * as  dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import fs from 'fs';
import limiter from './utils/rateLimiter'
import urlRouter from "./routes/urlRoutes";
import authRouter from "./routes/userRoutes";
import swaggerUi from 'swagger-ui-express';
import './database/mongoDB';
import './authConfig/config';
const swaggerDocument  = require('../swagger.json');


const PORT = Number(process.env.PORT);

const app : Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
  });

app.use(
    cors({
      origin: ['https://scissor-client.onrender.com', 'http://localhost:5173'],
      methods: 'GET, POST',
      allowedHeaders: 'Content-Type, Authorization',
    })
);
app.use(limiter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/auth', authRouter)
app.use('/urls', urlRouter);
  


app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({ Msg: "Welcome to Scissor URL shortener" });
});

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        message: "Sorry, the requested route does not exist!"
    })
    next()
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({ message: err.message });
});
  

app.listen(PORT, () => {
  console.log(`your application is running on ${process.env.HOST}:${process.env.PORT}`);
});