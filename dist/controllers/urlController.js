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
exports.deleteUrl = exports.getUrls = exports.redirect = exports.create = void 0;
const Url_1 = __importDefault(require("../models/Url"));
const redisCache_1 = __importDefault(require("../database/redisCache"));
const validateUrl_1 = __importDefault(require("../utils/validateUrl"));
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqUrl = req.body.url;
        let user = req.user;
        let userId = user._id;
        const existing = yield Url_1.default.findOne({ full: reqUrl, createdBy: userId });
        if (existing) {
            return res.status(400).json({ msg: "Url already exists" });
        }
        if ((0, validateUrl_1.default)(reqUrl)) {
            const url = new Url_1.default({
                full: reqUrl,
                createdBy: userId
            });
            const savedUrl = yield url.save();
            res.status(200).json({ url: savedUrl });
        }
        else {
            res.status(404).json({ error: "invalid URL format" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.create = create;
const redirect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shortUrl = req.params.shortUrl;
        const cachedURL = yield redisCache_1.default.get(shortUrl);
        if (cachedURL) {
            console.log(`From cache: ${cachedURL}`);
            res.redirect(301, `${cachedURL}`);
        }
        else {
            const url = yield Url_1.default.findOne({ short: shortUrl });
            if (url) {
                yield redisCache_1.default.set(shortUrl, url.full);
                res.redirect(301, `${url.full}`);
            }
            else {
                res.status(404).json({ error: "URL not found" });
            }
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.redirect = redirect;
const getUrls = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = req.user;
        let userId = user._id;
        const url = yield Url_1.default.find({ createdBy: userId });
        if (url.length > 0) {
            res.status(200).json({ urls: url });
        }
        else {
            res.status(404).json({ error: "No Url Exists for this user" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getUrls = getUrls;
const deleteUrl = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = req.user;
        let userId = user._id;
        const shortUrl = req.params.shortUrl;
        const url = yield Url_1.default.findOne({ short: shortUrl });
        if (url && url.createdBy == userId) {
            yield Url_1.default.deleteOne({ short: shortUrl });
            res.status(200).json({ Url: `${shortUrl} deleted successfully` });
        }
        else {
            res.status(404).json({ error: "URL not found" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.deleteUrl = deleteUrl;
