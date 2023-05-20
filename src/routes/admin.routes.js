import express from 'express'
import AdminController from '../controllers/admin'

const adminRouter = express.Router()

adminRouter.post('/', AdminController.create)
adminRouter.get('/', AdminController.view)

adminRouter.post('/login', AdminController.login)
adminRouter.get('/:id', AdminController.viewById)
adminRouter.put('/:id', AdminController.updateById)
adminRouter.delete('/:id', AdminController.deleteById)
adminRouter.post('/refresh', AdminController.refreshToken)
adminRouter.get('/:id/verification/status', AdminController.getTotpStatusById)
adminRouter.post('/:id/verification/choose-method', AdminController.chooseTOTPMethod)
adminRouter.post('/:id/verification', AdminController.verifyTOTPbyId)

export default adminRouter
