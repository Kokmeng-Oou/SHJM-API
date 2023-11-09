import express from 'express'
import userModel from '../model/userModel'
import { BadRequestError, UnauthenticatedError } from '../err'
import createTokenUser from '../utils/createTokenUser'
import { attachCookiesToResponse } from '../utils/jwt'

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { name, email, password } = req.body
    const isFirstAccount: boolean = (await userModel.countDocuments({})) === 0
    const role: 'admin' | 'user' = isFirstAccount ? 'admin' : 'user'

    const user = await userModel.create({ name, email, password, role })
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({ res, user: tokenUser })
    return res
      .status(201)
      .json({ message: 'Register Success', data: tokenUser })
  } catch (error) {
    res.status(409).json({ msg: `${(error as any).message}` })
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
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({ res, user: tokenUser })
    return res.status(200).json({ message: 'Login Success', data: tokenUser })
  } catch (error) {
    res.status(403).json({ msg: `${(error as any).message}` })
  }
}
