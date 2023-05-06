import express from 'express'
import authRouter from './auth.routes'
import userRouter from './user.routes'
import submissionRouter from './submission.routes'
import adminRouter from './admin.routes'
import employeeRouter from './employee.routes'
import { protect, adminProtect } from '../middleware/auth'

const router = express.Router()

router.use('/auth', authRouter)
router.use('/submissions', protect, submissionRouter)
router.use('/users', protect, userRouter)
router.use('/admin', adminRouter)
router.use('/employee', employeeRouter)

export default router
