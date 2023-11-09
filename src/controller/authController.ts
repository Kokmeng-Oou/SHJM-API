import express from 'express'
import userModel from '../model/userModel'
import { BadRequestError, UnauthenticatedError } from '../err'
import createTokenUser from '../utils/createTokenUser'
import { attachCookiesToResponse } from '../utils/jwt'
import { StatusCodes } from 'http-status-codes'

import crypto from 'crypto'

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
    // const tokenUser = createTokenUser(user)
    // attachCookiesToResponse({ res, user: tokenUser })
    return res.status(201).json({
      message: 'Register Success! Please check your email to verify account',
      verificationToken: verificationToken,
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
    attachCookiesToResponse({ res, user: tokenUser })
    return res.status(200).json({ message: 'Login Success', data: tokenUser })
  } catch (error) {
    res.status(403).json({ msg: `${(error as any).message}` })
  }
}

export const logout = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    res
      .clearCookie('token')
      .status(StatusCodes.NO_CONTENT)
      .json({ msg: 'Logout Success' })
  } catch (err) {
    console.log(`[ERROR] ${err}`)
  }
}
