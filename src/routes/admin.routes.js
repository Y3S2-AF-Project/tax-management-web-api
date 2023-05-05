import express from 'express'
import AdminController from '../controllers/admin'

const adminRouter = express.Router()

adminRouter.post('/', AdminController.create)
adminRouter.get('/', AdminController.view)
adminRouter.get('/:id', AdminController.viewById)
adminRouter.put('/:id', AdminController.updateById)
adminRouter.delete('/:id', AdminController.deleteById)
adminRouter.post('/login', AdminController.login)
adminRouter.post('/refresh', AdminController.refreshToken)

export default adminRouter
