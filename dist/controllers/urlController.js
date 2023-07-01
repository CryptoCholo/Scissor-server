"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redirect = exports.create = void 0;
const Url_1 = __importDefault(require("../models/Url"));
const redisCache_1 = __importDefault(require("../database/redisCache"));
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield Url_1.default.findOne({ full: req.body.url }).lean();
    if (existing) {
        res.status(400).json({ msg: 'Url already exists' });
        return;
    }
    console.log(req.body.url);
    const url = new Url_1.default({
        full: req.body.url,
    });
    const savedUrl = yield url.save();
    res.status(200).json({ url: savedUrl });
});
exports.create = create;
const redirect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let shortUrl = req.params.shortUrl;
        const cachedURL = yield redisCache_1.default.get(shortUrl);
        if (cachedURL) {
            console.log(`from cache, ${cachedURL}`);
            return res.status(301).redirect(`https://${cachedURL}`);
        }
        const url = yield Url_1.default.findOne({ short: shortUrl }).lean();
        if (url) {
            console.log('from db');
            yield redisCache_1.default.set(shortUrl, url.full);
            res.status(200).redirect(`https://${url.full}`);
            return;
        }
        res.status(404).json({ error: "url not found" });
    }
    catch (err) {
        console.log(err);
    }
});
exports.redirect = redirect;
