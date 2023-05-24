import AdminRepository from '../repository/admin'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import EncryptionService from '../encryption/encryption.service'
import AdminEmailService from '../email/admin.emails'
import 'dotenv/config'

const getTOTPSecret = () => {
  const secret = speakeasy.generateSecret({ length: 20 }).base32
  return EncryptionService.encrypt(secret)
}

const decryptTOTPSecret = (secret) => {
  return EncryptionService.decrypt(secret)
}

const generateTOTP = (secret) => {
  return speakeasy.totp({ secret, encoding: 'base32' })
}

const generateQRCode = async (secret) => {
  const otpauthURL = speakeasy.otpauthURL({
    secret,
    label: 'Tax Management System',
    issuer: 'Tax Management System',
    encoding: 'base32'
  })
  return await QRCode.toDataURL(otpauthURL)
}

const verifyTOTP = (secret, token) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 10
  })
}

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
  const secret = getTOTPSecret()
  const newAdmin = {
    id,
    ...admin,
    password: hashedPassword,
    lastUpdatedBy: admin.addedBy,
    secret
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
    gender: admin.gender,
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
  const response = {
    _id: admin._id,
    id: admin.id,
    firstName: admin.firstName,
    lastName: admin.lastName,
    email: admin.email,
    phone: admin.phone,
    isFirstLogin: admin.isFirstLogin
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

const getTotpStatusById = async (id) => {
  const admin = await AdminRepository.getAdminById(id)
  if (admin) {
    if (admin.isFirstLogin) {
      return { isFirstTime: true }
    }
    if (admin.choosenOTPMethod === 'email') {
      AdminEmailService.sendOTP(admin, generateTOTP(decryptTOTPSecret(admin.secret)))
    }
    return { isFirstTime: false, choosenOTPMethod: admin.choosenOTPMethod }
  }
  throw new Error('Invalid admin id')
}

const verifyTOTPbyId = async (id, token) => {
  const admin = await AdminRepository.getAdminById(id)
  if (admin) {
    const verified = verifyTOTP(decryptTOTPSecret(admin.secret), token)
    if (verified) {
      const accessToken = generateToken(admin)
      const refreshToken = generateRefreshToken(admin)
      const response = {
        _id: admin._id,
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        gender: admin.gender,
        email: admin.email,
        phone: admin.phone,
        permissions: admin.permissions,
        avatar: admin.avatar,
        isFirstLogin: admin.isFirstLogin,
        accessToken,
        refreshToken,
        isTOTPVerified: true
      }
      await AdminEmailService.sendLoginAlert(admin)
      return response
    }
    throw new Error('Invalid token')
  } else {
    throw new Error('Invalid admin id')
  }
}

const chooseTOTPMethod = async (id, method) => {
  const admin = {
    choosenOTPMethod: method,
    isFirstLogin: false
  }
  return await AdminRepository.updateAdminById(id, admin)
    .then(async (data) => {
      const secretDecrypted = decryptTOTPSecret(data.secret)
      if (method === 'email') {
        AdminEmailService.sendOTP(data, generateTOTP(secretDecrypted))
        return { choosenMethod: method }
      } else if (method === 'app') {
        const qrCode = await generateQRCode(secretDecrypted)
        return { qrCode: qrCode, choosenMethod: method }
      }
    })
    .catch((err) => {
      logger.error(`An error occurred when updating admin by id - err: ${err.message}`)
      throw err
    })
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
  refreshToken,
  getTotpStatusById,
  verifyTOTPbyId,
  chooseTOTPMethod
}

export default AdminService
