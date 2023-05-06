import logger from '../utils/logger'
import Employee from '../models/employee'

export const insertEmployee = async (employee) => {
  return await Employee.create(employee)
    .then(async (result) => {
      await result.save()
      logger.info(`Employee created successfully - id: ${result.id}`)
      delete result._doc.password
      return result
    })
    .catch((err) => {
      logger.error(`An error occurred when creating employee - err: ${err.message}`)
      throw err
    })
}

export const getEmployees = async () => {
  return await Employee.find({}, { password: 0 })
    .lean()
    .then((result) => {
      if (result) return result
      else throw new Error('No employees found')
    })
    .catch((err) => {
      logger.error(`An error occurred when retrieving employees - err: ${err.message}`)
      throw err
    })
}

export const getEmployeeById = async (id) => {
  return await Employee.findById(id)
    .lean()
    .then((result) => {
      if (result) return result
      else throw new Error(`Employee not found - id: ${id}`)
    })
    .catch((err) => {
      logger.error(`An error occurred when retrieving employee - err: ${err.message}`)
      throw err
    })
}

export const getEmployeeByEmail = async (email) => {
  return await Employee.findOne({ email })
    .lean()
    .then((result) => result)
    .catch((err) => {
      logger.error(`An error occurred when retrieving employee - err: ${err.message}`)
      throw err
    })
}

export const updateEmployeeById = async (id, updateBody) => {
  return await Employee.findByIdAndUpdate(id, updateBody, { new: true })
    .lean()
    .then((result) => {
      if (result) {
        delete result.password
        return result
      } else throw new Error(`Employee not found - id: ${id}`)
    })
    .catch((err) => {
      logger.error(`An error occurred when updating employee - err: ${err.message}`)
      throw err
    })
}

export const deleteEmployeeById = async (id) => {
  return await Employee.findByIdAndDelete(id)
    .lean()
    .then((result) => {
      if (result) return result
      else throw new Error(`Employee not found - id: ${id}`)
    })
    .catch((err) => {
      logger.error(`An error occurred when deleting employee - err: ${err.message}`)
      throw err
    })
}

export const getEmployeeByEmployeeId = async (employeeId) => {
  return await Employee.findOne({ id: employeeId })
    .lean()
    .then((result) => result)
    .catch((err) => {
      logger.error(`An error occurred when retrieving employee - err: ${err.message}`)
      throw err
    })
}

export const getPermissionsById = async (id) => {
  return await Employee.findById(id)
    .lean()
    .then((result) => {
      if (result) return result.permissions
      else throw new Error(`Employee not found - id: ${id}`)
    })
    .catch((err) => {
      logger.error(`An error occurred when retrieving employee - err: ${err.message}`)
      throw err
    })
}

export const updatePermissionsById = async (id, updateBody) => {
  return await Employee.findById(id)
    .lean()
    .then((result) => {
      if (result) {
        result.permissions = updateBody
        result.save()
        return result
      } else throw new Error(`Employee not found - id: ${id}`)
    })
    .catch((err) => {
      logger.error(`An error occurred when updating employee - err: ${err.message}`)
      throw err
    })
}

export const getLastInsertedEmployee = async () => {
  return await Employee.findOne()
    .sort({ _id: -1 })
    .lean()
    .then((result) => {
      return result
    })
    .catch((err) => {
      logger.error(`An error occurred when retrieving employees - err: ${err.message}`)
      throw err
    })
}

const EmployeeRepository = {
  insertEmployee,
  getEmployees,
  getEmployeeById,
  getEmployeeByEmail,
  updateEmployeeById,
  deleteEmployeeById,
  getEmployeeByEmployeeId,
  getPermissionsById,
  updatePermissionsById,
  getLastInsertedEmployee
}

export default EmployeeRepository
