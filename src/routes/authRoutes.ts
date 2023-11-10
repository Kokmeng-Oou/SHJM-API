import express from 'express'
import {
  register,
  login,
  logout,
  verifyEmail,
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

export default router
