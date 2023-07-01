import Url from "../models/Url";
import { RequestHandler,  Request, Response, NextFunction } from "express";
import { IUrl } from "../models/Url";
import redisClient from "../database/redisCache";


export const create: RequestHandler = async (req : Request, res: Response, next : NextFunction) => {
  const existing = await Url.findOne({ full: req.body.url }).lean();
  if (existing) {
    res.status(400).json({ msg:'Url already exists' });
    return;
  }
console.log(req.body.url);

  const url = new Url({
    full: req.body.url,
  });
  const savedUrl: IUrl = await url.save();
  res.status(200).json({ url: savedUrl });
};

export const redirect: RequestHandler = async (req : Request, res : Response, next : NextFunction) => {
  try {
    let shortUrl = req.params.shortUrl;
    
    const cachedURL = await redisClient.get(shortUrl);
     
      if (cachedURL) {
        console.log(`from cache, ${cachedURL}`)
        return  res.status(301).redirect(`https://${cachedURL}`);
         
      }
  
    const url = await Url.findOne({ short: shortUrl }).lean();
  
    if (url) {
      console.log('from db')
      await redisClient.set(shortUrl, url.full);
      res.status(200).redirect(`https://${url.full}`);
      return;
    }
    res.status(404).json({ error: "url not found" });
  } catch (err) {
    console.log(err);
  }
};