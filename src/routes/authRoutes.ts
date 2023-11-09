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
} from '../middleware/authenticationMiddleware'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/verify-email', verifyEmail)

export default router
