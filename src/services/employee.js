import EmployeeRepository from '../repository/employee'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const generateId = async () => {
  const lastInsertedEmployee = await EmployeeRepository.getLastInsertedEmployee()
  if (lastInsertedEmployee) {
    const lastId = lastInsertedEmployee.id
    const lastIdNumber = parseInt(lastId.split('-')[1])
    return `EMP-${lastIdNumber + 1}`
  } else {
    return 'EMP-1001'
  }
}

const checkIfEmailExists = async (email) => {
  const employee = await EmployeeRepository.getEmployeeByEmail(email)
  if (employee) {
    return true
  } else {
    return false
  }
}

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword)
}

const generateToken = async (employee) => {
  const payload = {
    id: employee._id,
    email: employee.email,
    permissions: employee.permissions
  }
  return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '30m' })
}

const generateRefreshToken = async (employee) => {
  const payload = {
    id: employee._id,
    email: employee.email,
    permissions: employee.permissions
  }
  return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

export const insertEmployee = async (employee) => {
  if (await checkIfEmailExists(employee.email)) {
    throw new Error(`Email already exists - email: ${employee.email}`)
  }
  const id = await generateId()
  const hashedPassword = await hashPassword(employee.password)
  const newEmployee = {
    id,
    ...employee,
    password: hashedPassword,
    lastUpdatedBy: employee.addedBy
  }
  return await EmployeeRepository.insertEmployee(newEmployee)
}

export const getEmployeeById = async (id) => {
  return await EmployeeRepository.getEmployeeById(id)
}

export const getEmployeeByEmail = async (email) => {
  return await EmployeeRepository.getEmployeeByEmail(email)
}

export const getEmployees = async () => {
  return await EmployeeRepository.getEmployees()
}

export const updateEmployee = async (id, employee) => {
  const hashedPassword = await hashPassword(employee.password)
  const updatedEmployee = {
    ...employee,
    password: hashedPassword,
    lastUpdatedBy: employee.updatedBy
  }
  return await EmployeeRepository.updateEmployeeById(id, updatedEmployee)
}

export const deleteEmployee = async (id) => {
  return await EmployeeRepository.deleteEmployeeById(id)
}

export const login = async (email, password) => {
  const employee = await EmployeeRepository.getEmployeeByEmail(email)
  if (!employee) {
    throw new Error(`Email not found - email: ${email}`)
  }
  const isMatch = await comparePassword(password, employee.password)
  if (!isMatch) {
    throw new Error(`Password mismatch - email: ${email}`)
  }
  const token = await generateToken(employee)
  const refreshToken = await generateRefreshToken(employee)
  return { token, refreshToken }
}

export const refreshToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET)
    const employee = await EmployeeRepository.getEmployeeById(decoded.id)
    if (!employee) {
      throw new Error(`Invalid refresh token - id: ${decoded.id}`)
    }
    const token = await generateToken(employee)
    return { token }
  } catch (error) {
    throw new Error(`Invalid refresh token - ${error.message}`)
  }
}

const EmployeeService = {
  insertEmployee,
  getEmployeeById,
  getEmployeeByEmail,
  getEmployees,
  updateEmployee,
  deleteEmployee,
  login,
  refreshToken
}

export default EmployeeService
