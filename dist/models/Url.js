"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.UrlSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const shortid_1 = __importDefault(require("shortid"));
const qrcode_1 = __importDefault(require("qrcode"));
exports.UrlSchema = new mongoose_1.Schema({
    full: {
        required: true,
        type: String,
    },
    qrcode: {
        type: String,
    },
    short: {
        required: true,
        type: String,
        default: shortid_1.default.generate,
    },
    createdBy: {
        required: true,
        type: String
    },
});
exports.UrlSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        qrcode_1.default.toString(this.short, (err, code) => {
            if (err) {
                // Handle the error
                return next(err);
            }
            console.log(code);
            this.qrcode = JSON.stringify(code);
            next();
        });
    });
});
const Url = mongoose_1.default.model("Url", exports.UrlSchema);
exports.default = Url;
