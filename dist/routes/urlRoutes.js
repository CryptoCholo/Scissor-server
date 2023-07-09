"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const urlController_1 = require("../controllers/urlController");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.get("/:shortUrl", urlController_1.redirect);
router.use(passport_1.default.authenticate('jwt', { session: false }));
router.post("/", urlController_1.create);
router.get("/", urlController_1.getUrls);
router.delete("/:shortUrl", urlController_1.deleteUrl);
exports.default = router;
