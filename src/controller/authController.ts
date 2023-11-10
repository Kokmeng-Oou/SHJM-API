import express from 'express'
import userModel from '../model/userModel'
import { BadRequestError, UnauthenticatedError } from '../err'
import createTokenUser from '../utils/createTokenUser'
import { attachCookiesToResponse } from '../utils/jwt'
import { StatusCodes } from 'http-status-codes'

import crypto from 'crypto'
import sendVerificationEmail from '../utils/sendVerificationEmail'
import sendResetPasswordEmail from '../utils/sendResetPasswordEmail'
import createHash from '../utils/createHash'
import tokenModel from '../model/tokenModel'

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { name, email, password } = req.body
    const isFirstAccount: boolean = (await userModel.countDocuments({})) === 0
    const role: 'admin' | 'member' = isFirstAccount ? 'admin' : 'member'
    const verificationToken = crypto.randomBytes(40).toString('hex')
    const user = await userModel.create({
      name,
      email,
      password,
      role,
      verificationToken,
    })
    const origin = req.get('origin') as string
    await sendVerificationEmail({
      name: user.name,
      email: user.email,
      verification: user.verificationToken,
      origin: origin,
    })

    return res.status(201).json({
      message: 'Register Success! Please check your email to verify account',
    })
  } catch (error) {
    res.status(409).json({ msg: `${(error as any).message}` })
  }
}

export const verifyEmail = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { verificationToken, email } = req.query
    if (!verificationToken && !email)
      throw new BadRequestError('Verify Email Failed')
    const user = await userModel.findOne({ email })
    if (!user) throw new UnauthenticatedError('Verification failed')
    if (user?.verificationToken !== verificationToken)
      throw new UnauthenticatedError('Verification failed')
    await userModel.updateOne(
      { email: user.email },
      {
        isVerified: true,
        verifiedAt: Date.now(),
        verificationToken: '',
      }
    )
    res.status(StatusCodes.OK).json({
      message: `Welcome ${req.query?.email}, Your Account has been Verified`,
    })
  } catch (error) {
    res.status(500).json({ msg: `${(error as Error).message}` })
  }
}

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      throw new BadRequestError('Email or Password not provided')
    const user = await userModel.findOne({ email }).select('+password')
    if (!user) throw new UnauthenticatedError('user not found')
    const validPassword = await user?.isValidPassword(password)
    if (!validPassword) throw new UnauthenticatedError('Invalid Password')
    if (!user?.isVerified)
      throw new UnauthenticatedError('Please verify your email')
    const tokenUser = createTokenUser(user)
    // create refresh token
    let refreshToken = ''
    // check for existing token
    const existingToken = await tokenModel.findOne({ user: user._id })

    if (existingToken !== null) {
      const { isValid } = existingToken
      if (!isValid) {
        throw new UnauthenticatedError('Invalid Credentials')
      }
      refreshToken = existingToken.refreshToken
      attachCookiesToResponse({ res, user: tokenUser, refreshToken })
      return res.status(200).json({ message: 'Login Success', data: tokenUser })
    }
    refreshToken = crypto.randomBytes(40).toString('hex')
    const userAgent = req.headers['user-agent']
    const ip = req.ip
    const userToken = { refreshToken, ip, userAgent, user: user._id }
    await tokenModel.create(userToken)
    attachCookiesToResponse({ res, user: tokenUser, refreshToken })
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Login Success', data: tokenUser })
  } catch (error) {
    res.status(403).json({ msg: `${(error as any).message}` })
  }
}

export const logout = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    await tokenModel.findOneAndDelete({ user: (req as any).user.user })
    res.cookie('accessToken', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    res.cookie('refreshTokenJWT', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    res.status(StatusCodes.NO_CONTENT).json({ msg: 'Logout Success' })
  } catch (err) {
    console.log(`[ERROR] ${err}`)
  }
}

export const forgotPassword = async (
  req: express.Request,
  res: express.Response
) => {
  const { email } = req.body
  if (!email) throw new BadRequestError('Please provide valid email')
  const user = await userModel.findOne({ email })
  if (user) {
    const passwordToken = crypto.randomBytes(70).toString('hex')
    const origin = `http://localhost:3000/`
    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      origin: origin,
    })
    const tenMin = 1000 * 60 * 10
    const passwordTokenExpiresAt = new Date(Date.now() + tenMin)
    ;(user as any).passwordToken = createHash(passwordToken)
    ;(user as any).passwordTokenExpiresAt = passwordTokenExpiresAt
    await user.save()
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Please check your email for reset password link' })
}

export const resetPassword = async (
  req: express.Request,
  res: express.Response
) => {
  const { token, email, password } = req.body
  if (!token || !email || !password)
    throw new BadRequestError('Please provide all values')
  const user = await userModel.findOne({ email })
  if (user) {
    const currentDate: Date = new Date()
    if (
      user.passwordToken === createHash(token) &&
      (user as any).passwordTokenExpiresAt > currentDate
    ) {
      user.password = password
      ;(user as any).passwordToken = null
      ;(user as any).passwordTokenExpiresAt = null
      await user.save()
    }
  }
  res.send('reset password')
}
