import { Router } from "express";
import { create, redirect, getUrls, deleteUrl} from "../controllers/urlController";
import passport from 'passport';


const router = Router();


router.get("/:shortUrl", redirect);


router.use(passport.authenticate('jwt', {session: false}));

router.post("/",  create);
router.get("/", getUrls);
router.delete("/:shortUrl", deleteUrl);



export default router;