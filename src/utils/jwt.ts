import jwt from 'jsonwebtoken'

export const createJWT = ({ payload }: any) => {
  const token: string = jwt.sign(payload, process.env.JWT_SECRET as string)
  return token
}

export const isTokenValid = (token: any) =>
  jwt.verify(token as string, process.env.JWT_SECRET as string)

export const attachCookiesToResponse = ({ res, user, refreshToken }: any) => {
  const accessTokenJWT = createJWT({ payload: { user } })
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } })
  const oneDay = 1000 * 60 * 60 * 24
  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    maxAge: 1000 * 60 * 60,
  })
  res.cookie('refreshTokenJWT', refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + oneDay),
  })
}

export const attachSingleCookiesToResponse = ({ res, user }: any) => {
  const token = createJWT({ payload: user })
  const oneDay = 1000 * 60 * 60 * 24
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  })
}
