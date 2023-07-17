import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

const exceptionMessages = {
  'string.base': '{{#label}} should be a type of \'text\'',
  'string.empty': '{{#label}} cannot be an empty field',
  'string.min': '{{#label}} should have a minimum length of {#limit}',
  'any.required': '{{#label}} is a required field',
};


//SIGNUP VALIDATOR
const signUpSchema = Joi.object({
  fullname: Joi.string()
    .min(3).max(40).required()
    .messages(exceptionMessages),
    username: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().messages(exceptionMessages),
  password: Joi.string()
    .min(8).required()
    .messages(exceptionMessages),
    cpassword: Joi.any().valid(Joi.ref('password')).required().messages(exceptionMessages),
});

function signUpValidator(req:Request, res:Response, next: NextFunction) {
  const { error } = signUpSchema.validate(req.body);

  if (error) {

    const { details } = error;
    const errorMessages = details.map(({ message }) => message);
    return res.status(400).json({ status: 'Validation error', details: errorMessages });
  }

  return next();
}



//LOGIN VALIDATOR
const loginSchema = Joi.object({
    username: Joi.string()
      .min(3).max(20).required()
      .messages(exceptionMessages),
    password: Joi.string()
      .min(8).required()
      .messages(exceptionMessages),
});
  

function loginValidator(req:Request, res:Response, next: NextFunction) {
    const { error } = loginSchema.validate(req.body);
  
    if (error) {
      const { details } = error;
      const errorMessages = details.map(({ message }) => message);
      return res.status(400).json({ status: 'Validation error', details: errorMessages });
    }
    return next();
}



export { signUpValidator, loginValidator };