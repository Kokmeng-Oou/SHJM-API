import express from 'express'
import { register } from '../controller/authController'
import { validateRegister } from '../middleware/authenticationMiddleware'

const router = express.Router()

router.post('/register', validateRegister, register)
// router.post('/')
// router.post('/')

export default router
