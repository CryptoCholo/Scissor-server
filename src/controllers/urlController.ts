import Url from "../models/Url";
import { RequestHandler,  Request, Response, NextFunction } from "express";
import { IUrl } from "../models/Url";
import { IUser } from "../models/User";
import redisClient from "../database/redisCache";
import validateUrl from "../utils/validateUrl";


export const create: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reqUrl = req.body.url;
    let user  = req.user as IUser;
    let userId = user._id;

    const existing = await Url.findOne({ full: reqUrl, createdBy: userId }).lean();
    if (existing) {
      return res.status(400).json({ msg: "Url already exists" });
    }

    if (validateUrl(reqUrl)) {
      const url: IUrl = new Url({
        full: reqUrl,
        createdBy: userId
      });

    const savedUrl = await url.save();

      res.status(200).json({ url: savedUrl });
    } else {
      res.status(404).json({ error: "invalid URL format" });
    }} catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const redirect: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const shortUrl = req.params.shortUrl;
    const cachedURL = await redisClient.get(shortUrl);

    if (cachedURL) {
      console.log(`From cache: ${cachedURL}`);
      res.redirect(301, `${cachedURL}`);
    } else {
      const url: IUrl = await Url.findOne({ short: shortUrl });

      if (url) {
        await redisClient.set(shortUrl, url.full);
        res.redirect(301, `${url.full}`);
      } else {
        res.status(404).json({ error: "URL not found" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getUrls: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let user  = req.user as IUser;
    let userId = user._id;
    
      const url = await Url.find({ createdBy: userId});

      if (url.length > 0) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
        res.status(200).json({urls: url});
      } else {
        res.status(404).json({ error: "No Url Exists for this user" });
      }
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const deleteUrl: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let user  = req.user as IUser;
    let userId = user._id;
    const shortUrl = req.params.shortUrl;

      const url = await Url.findOne({ short: shortUrl});

      if (url && url.createdBy == userId) {
        await Url.deleteOne({short: shortUrl})

        res.status(200).json({Url: `${shortUrl} deleted successfully`});
      } else {
        res.status(404).json({ error: "URL not found" });
      }
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};