// import jwt from 'jsonwebtoken'

// export const createJWT = ({ payload }: any) => {
//   const token: string = jwt.sign(payload, process.env.JWT_SECRET as string, {
//     expiresIn: process.env.EXPIRES_IN as string,
//   })
//   return token
// }

// export const attachCookiesToResponse = ({ res, user }: any) => {
//   const token = createJWT({ payload: user })
//   const oneDay = 1000 * 60 * 60 * 24
//   res.cookie('token', token, {
//     httpOnly: true,
//     expires: new Date(Date.now() + oneDay),
//     secure: process.env.NODE_ENV === 'production',
//     signed: true,
//   })
// }
