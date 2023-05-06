import asyncHandler from '../middleware/async'
import EmployeeService from '../services/employee'
import EmployeeEmailService from '../email/employee.emails'
import { makeResponse } from '../utils/response'
import generator from 'generate-password'

const generatePassword = async () => {
  return generator.generate({
    length: 10,
    numbers: true,
    uppercase: true,
    lowercase: true,
    symbols: true,
    excludeSimilarCharacters: true
  })
}

export const create = asyncHandler(async (req, res) => {
  const password = await generatePassword()
  req.body.password = password
  await EmployeeService.insertEmployee(req.body)
    .then(async (data) => {
      await EmployeeEmailService.sendGeneratedPassord(data, password)
      return makeResponse({ res, status: 201, data, message: 'Employee added successfully' })
    })
    .catch((err) => {
      return makeResponse({ res, status: 400, message: err.message })
    })
})

export const view = asyncHandler(async (req, res) => {
  await EmployeeService.getEmployees(req.query)
    .then((data) => {
      return makeResponse({ res, status: 200, data, message: 'Employees retrieved successfully' })
    })
    .catch((err) => {
      return makeResponse({ res, status: 400, message: err.message })
    })
})

export const viewById = asyncHandler(async (req, res) => {
  await EmployeeService.getEmployeeById(req.params.id)
    .then((data) => {
      return makeResponse({ res, status: 200, data, message: 'Employee retrieved successfully' })
    })
    .catch((err) => {
      return makeResponse({ res, status: 400, message: err.message })
    })
})

export const updateById = asyncHandler(async (req, res) => {
  await EmployeeService.updateEmployee(req.params.id, req.body)
    .then((data) => {
      return makeResponse({ res, status: 200, data, message: 'Employee updated successfully' })
    })
    .catch((err) => {
      return makeResponse({ res, status: 400, message: err.message })
    })
})

export const deleteById = asyncHandler(async (req, res) => {
  await EmployeeService.deleteEmployee(req.params.id)
    .then((data) => {
      return makeResponse({ res, status: 200, data, message: 'Employee deleted successfully' })
    })
    .catch((err) => {
      return makeResponse({ res, status: 400, message: err.message })
    })
})

export const login = asyncHandler(async (req, res) => {
  await EmployeeService.login(req.body.email, req.body.password)
    .then((data) => {
      return makeResponse({ res, status: 200, data, message: 'Employee logged in successfully' })
    })
    .catch((err) => {
      return makeResponse({ res, status: 400, message: err.message })
    })
})

export const refresh = asyncHandler(async (req, res) => {
  await EmployeeService.refreshToken(req.body.refreshToken)
    .then((data) => {
      return makeResponse({ res, status: 200, data, message: 'Employee token refreshed successfully' })
    })
    .catch((err) => {
      return makeResponse({ res, status: 400, message: err.message })
    })
})

const EmployeeController = {
  create,
  view,
  viewById,
  updateById,
  deleteById,
  login,
  refresh
}

export default EmployeeController
