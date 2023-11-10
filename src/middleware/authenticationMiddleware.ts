import express from 'express'
import { loginSchema, registerSchema } from '../validation/authValidation'
import { BadRequestError, UnauthenticatedError } from '../err'
import { attachCookiesToResponse, isTokenValid } from '../utils/jwt'
import tokenModel from '../model/tokenModel'

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

export async function validateLogin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const result: {
      email: string
      username: string
    } = await loginSchema.validateAsync(req.body)
    ;(req as any).user == result
    return next()
  } catch (e) {
    throw new BadRequestError((e as any).message)
  }
}

// export async function validateForgetPassword(
//   req: express.Request,
//   res: express.Response,
//   next: express.NextFunction
// ) {

// }

export const authenticationUser = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { refreshToken, accessToken }: any = req.signedCookies

  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken) as any
      ;(req as any).user = payload.user
      return next()
    }
    const payload = isTokenValid(refreshToken) as any
    const existingToken = await tokenModel.findOne({
      user: payload?.user?.user,
      refreshToken: payload.refreshToken,
    })
    if (!existingToken || !existingToken?.isValid) {
      throw new UnauthenticatedError('Authentication Invalid')
    }
    const { user } = payload
    const existingRefreshToken = existingToken.refreshToken
    attachCookiesToResponse({ res, user, existingRefreshToken })
    ;(req as any).user = payload.user
    next()
  } catch (error) {
    throw new UnauthenticatedError('Authentication Invalid')
  }
}
