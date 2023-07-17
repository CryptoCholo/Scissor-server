"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidator = exports.signUpValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const exceptionMessages = {
    'string.base': '{{#label}} should be a type of \'text\'',
    'string.empty': '{{#label}} cannot be an empty field',
    'string.min': '{{#label}} should have a minimum length of {#limit}',
    'any.required': '{{#label}} is a required field',
};
//SIGNUP VALIDATOR
const signUpSchema = joi_1.default.object({
    fullname: joi_1.default.string()
        .min(3).max(40).required()
        .messages(exceptionMessages),
    username: joi_1.default.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().messages(exceptionMessages),
    password: joi_1.default.string()
        .min(8).required()
        .messages(exceptionMessages),
    cpassword: joi_1.default.any().valid(joi_1.default.ref('password')).required().messages(exceptionMessages),
});
function signUpValidator(req, res, next) {
    const { error } = signUpSchema.validate(req.body);
    if (error) {
        const { details } = error;
        const errorMessages = details.map(({ message }) => message);
        return res.status(400).json({ status: 'Validation error', details: errorMessages });
    }
    return next();
}
exports.signUpValidator = signUpValidator;
//LOGIN VALIDATOR
const loginSchema = joi_1.default.object({
    username: joi_1.default.string()
        .min(3).max(20).required()
        .messages(exceptionMessages),
    password: joi_1.default.string()
        .min(8).required()
        .messages(exceptionMessages),
});
function loginValidator(req, res, next) {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        const { details } = error;
        const errorMessages = details.map(({ message }) => message);
        return res.status(400).json({ status: 'Validation error', details: errorMessages });
    }
    return next();
}
exports.loginValidator = loginValidator;
