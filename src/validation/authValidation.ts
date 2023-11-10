import Joi from 'joi'
import userModel from '../model/userModel'
import { BadRequestError } from '../err'

export const registerSchema = Joi.object({
  name: Joi.string().min(3).alphanum().required().messages({
    'string.min': 'Username must be at least 3 characters long',
    'string.alphanum': 'Username must contain only letters and numbers',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
  }),
  password: Joi.string()
    .min(8)
    .regex(/\d/)
    .regex(/[a-z]/)
    .regex(/[A-Z]/)
    .regex(/[^a-zA-Z0-9]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base':
        'Password must contain a number, a lowercase letter, an uppercase letter and a special character',
    }),
  confirmPassword: Joi.string().required(),
  role: Joi.string().valid('admin', 'member').required(),
})

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
  }),
  password: Joi.string()
    .min(8)
    .regex(/\d/)
    .regex(/[a-z]/)
    .regex(/[A-Z]/)
    .regex(/[^a-zA-Z0-9]/)
    .required(),
})

// export const setForgotPasswordSchema = Joi.object({
//   token: Joi.string().hex().length(24).required(),
//   newPassword: Joi.string()
// })

// // Define the set reset password schema
// export const setResetPasswordSchema = Joi.object({
//   password: Joi.string().min(6).max(128).required(),
//   resetToken: Joi.string().hex().length(32).required(),
// })
