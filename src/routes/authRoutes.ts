import express from 'express'
import { register, login } from '../controller/authController'
import {
  validateRegister,
  validateLogin,
} from '../middleware/authenticationMiddleware'

const router = express.Router()

router.post('/register', validateRegister, register)
router.post('/login', validateLogin, login)
// router.post('/')

export default router
