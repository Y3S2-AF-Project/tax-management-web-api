import AdminRepository from '../repository/admin'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const generateId = async () => {
  const lastInsertedAdmin = await AdminRepository.getLastInsertedAdmin()
  if (lastInsertedAdmin) {
    const lastId = lastInsertedAdmin.id
    const lastIdNumber = parseInt(lastId.split('-')[1])
    return `ADM-${lastIdNumber + 1}`
  } else {
    return 'ADM-1001'
  }
}

const checkIfEmailExists = async (email) => {
  const admin = await AdminRepository.getAdminByEmail(email)
  if (admin) {
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

const generateToken = async (admin) => {
  const payload = {
    id: admin._id,
    email: admin.email,
    permissions: admin.permissions
  }
  return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '30m' })
}

const generateRefreshToken = async (admin) => {
  const payload = {
    id: admin._id,
    email: admin.email,
    permissions: admin.permissions
  }
  return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

export const insertAdmin = async (admin) => {
  if (await checkIfEmailExists(admin.email)) {
    throw new Error(`Email already exists - email: ${admin.email}`)
  }
  const id = await generateId()
  const hashedPassword = await hashPassword(admin.password)
  const newAdmin = {
    id,
    firstName: admin.firstName,
    lastName: admin.lastName,
    email: admin.email,
    password: hashedPassword,
    phone: admin.phone,
    permissions: admin.permissions,
    addedBy: admin.addedBy,
    lastUpdatedBy: admin.addedBy
  }
  return await AdminRepository.insertAdmin(newAdmin)
    .then((result) => {
      return result
    })
    .catch((err) => {
      logger.error(`An error occurred when inserting admin - err: ${err.message}`)
      throw err
    })
}

export const getAdmins = async () => {
  return await AdminRepository.getAdmins()
}

export const getAdminById = async (id) => {
  return await AdminRepository.getAdminById(id)
}

export const updateAdminById = async (id, admin) => {
  const adminToUpdate = await AdminRepository.getAdminById(id)
  if (!adminToUpdate) {
    throw new Error(`Admin not found - id: ${id}`)
  }
  if (adminToUpdate.email !== admin.email && (await checkIfEmailExists(admin.email))) {
    throw new Error(`Email already exists - email: ${admin.email}`)
  }
  const updatedAdmin = {
    firstName: admin.firstName,
    lastName: admin.lastName,
    email: admin.email,
    phone: admin.phone,
    permissions: admin.permissions,
    lastUpdatedBy: admin.lastUpdatedBy
  }
  return await AdminRepository.updateAdminById(id, updatedAdmin)
}

export const deleteAdminById = async (id) => {
  return await AdminRepository.deleteAdminById(id)
}

export const getPermissionsByAdminId = async (id) => {
  return await AdminRepository.getPermissionsByAdminId(id)
}

export const updatePermissionsByAdminId = async (id, permissions) => {
  return await AdminRepository.updatePermissionsByAdminId(id, permissions)
}

export const login = async (email, password) => {
  const admin = await AdminRepository.getAdminByEmail(email)
  if (!admin) {
    throw new Error('Invalid email or password')
  }
  const isMatch = await comparePassword(password, admin.password)
  if (!isMatch) {
    throw new Error('Invalid email or password')
  }
  const accessToken = await generateToken(admin)
  const refreshToken = await generateRefreshToken(admin)
  const response = {
    _id: admin._id,
    id: admin.id,
    firstName: admin.firstName,
    lastName: admin.lastName,
    email: admin.email,
    phone: admin.phone,
    permissions: admin.permissions,
    avatar: admin.avatar,
    isFirstLogin: admin.isFirstLogin,
    accessToken,
    refreshToken
  }
  return response
}

export const refreshToken = async (refreshToken) => {
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET)
  const admin = await AdminRepository.getAdminById(decoded.id)
  if (!admin) {
    throw new Error('Invalid refresh token')
  }
  const accessToken = await generateToken(admin)
  const newRefreshToken = await generateRefreshToken(admin)
  const response = {
    accessToken,
    refreshToken: newRefreshToken
  }
  return response
}

const AdminService = {
  insertAdmin,
  getAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
  getPermissionsByAdminId,
  updatePermissionsByAdminId,
  login,
  refreshToken
}

export default AdminService
