"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const urlController_1 = require("../controllers/urlController");
const router = (0, express_1.Router)();
router.post("/", urlController_1.create);
router.get("/:shortUrl", urlController_1.redirect);
exports.default = router;
