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
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const redis_url = process.env['REDIS_URL'] || 'redis://redis:6379';
let redisClient;
(() => __awaiter(void 0, void 0, void 0, function* () {
    redisClient = (0, redis_1.createClient)({ url: redis_url });
    yield redisClient.connect();
    redisClient.on("error", (error) => console.error(`Cache ConnectionError : ${error}`));
    redisClient.on('ready', () => {
        console.log('Cache successfully connected.');
    });
}))();
exports.default = redisClient;
