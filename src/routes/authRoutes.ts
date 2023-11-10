import express from 'express'
import {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from '../controller/authController'
import {
  validateRegister,
  validateLogin,
  authenticationUser,
} from '../middleware/authenticationMiddleware'

const router = express.Router()

router.post('/register', validateRegister, register)
router.post('/login', validateLogin, login)
router.delete('/logout', authenticationUser, logout)
router.post('/verify-email', verifyEmail)
router.post('/reset-password', resetPassword)
router.post('/forgot-password', forgotPassword)

export default router
