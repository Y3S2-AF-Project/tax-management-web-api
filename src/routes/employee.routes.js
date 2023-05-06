import express from 'express'
import EmployeeController from '../controllers/employee'

const employeeRouter = express.Router()

employeeRouter.post('/', EmployeeController.create)
employeeRouter.get('/', EmployeeController.view)
employeeRouter.get('/:id', EmployeeController.viewById)
employeeRouter.put('/:id', EmployeeController.updateById)
employeeRouter.delete('/:id', EmployeeController.deleteById)
employeeRouter.post('/login', EmployeeController.login)
employeeRouter.post('/refresh', EmployeeController.refresh)

export default employeeRouter
