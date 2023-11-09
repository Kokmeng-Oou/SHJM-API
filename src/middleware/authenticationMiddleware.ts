import express from 'express'
import { registerSchema } from '../validation/authValidation'
import { BadRequestError } from '../err'

export async function validateRegister(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    await registerSchema.validateAsync(req.body)
    if (!req.body.password === req.body.confirmPassword)
      throw new BadRequestError('Confirm Password must be same to password')
    return next()
  } catch (e) {
    throw new BadRequestError((e as any).message)
  }
}

export const authenticationUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
  } catch (error) {}
}
