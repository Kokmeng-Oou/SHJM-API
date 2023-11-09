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
