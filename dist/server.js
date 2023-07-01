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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const cors_1 = __importDefault(require("cors"));
const rateLimiter_1 = __importDefault(require("./utils/rateLimiter"));
const urlRoutes_1 = __importDefault(require("./routes/urlRoutes"));
require("./database/mongoDB");
// import './config/passport';
const PORT = Number(process.env.PORT);
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
}));
app.use((0, cors_1.default)({
    origin: [process.env.CLIENT_URL, "http://localhost:5173"],
}));
app.use(rateLimiter_1.default);
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(urlRoutes_1.default);
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});
// Add your authentication routes  
app.get("/", (req, res, next) => {
    res.json({ hi: "There" });
});
// if (process.env.NODE_ENV !== 'test') {
app.listen(PORT, () => {
    console.log(`your application is running on ${process.env.HOST}:${process.env.PORT}`);
});
//   } else {
//     module.exports = app;
// }
