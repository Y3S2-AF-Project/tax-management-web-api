import asyncHandler from '../middleware/async'
import AdminService from '../services/admin'
import AdminEmailService from '../email/admin.emails'
import { makeResponse } from '../utils/response'
import generator from 'generate-password'
import sha256 from 'crypto-js/sha256'

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
  req.body.password = sha256(password).toString()
  await AdminService.insertAdmin(req.body)
    .then(async (data) => {
      await AdminEmailService.sendGeneratedPassord(data, password)
      return makeResponse({ res, status: 201, data, message: 'Admin added successfully' })
    })
    .catch((err) => {
      return makeResponse({ res, status: 400, message: err.message })
    })
})

export const view = asyncHandler(async (req, res) => {
  await AdminService.getAdmins(req.query)
    .then((data) => {
      return makeResponse({ res, status: 200, data, message: 'Admins retrieved successfully' })
    })
    .catch((err) => {
      return makeResponse({ res, status: 400, message: err.message })
    })
})

export const viewById = asyncHandler(async (req, res) => {
  await AdminService.getAdminById(req.params.id)
    .then((data) => {
      return makeResponse({ res, status: 200, data, message: 'Admin retrieved successfully' })
    })
    .catch((err) => {
      return makeResponse({ res, status: 400, message: err.message })
    })
})

export const updateById = asyncHandler(async (req, res) => {
  await AdminService.updateAdminById(req.params.id, req.body)
    .then((data) => {
      return makeResponse({ res, status: 200, data, message: 'Admin updated successfully' })
    })
    .catch((err) => {
      return makeResponse({ res, status: 400, message: err.message })
    })
})

export const deleteById = asyncHandler(async (req, res) => {
  await AdminService.deleteAdminById(req.params.id)
    .then((data) => {
      return makeResponse({ res, status: 200, data, message: 'Admin deleted successfully' })
    })
    .catch((err) => {
      return makeResponse({ res, status: 400, message: err.message })
    })
})

export const login = asyncHandler(async (req, res) => {
  await AdminService.login(req.body.email, req.body.password)
    .then((data) => {
      return makeResponse({ res, status: 200, data, message: 'Admin logged in successfully' })
    })
    .catch((err) => {
      return makeResponse({ res, status: 400, message: err.message })
    })
})

export const refreshToken = asyncHandler(async (req, res) => {
  await AdminService.refreshToken(req.body)
    .then((data) => {
      return makeResponse({ res, status: 200, data, message: 'Admin token refreshed successfully' })
    })
    .catch((err) => {
      return makeResponse({ res, status: 400, message: err.message })
    })
})

export const getTotpStatusById = asyncHandler(async (req, res) => {
  await AdminService.getTotpStatusById(req.params.id)
    .then((data) => {
      return makeResponse({ res, status: 200, data, message: 'Status retrieved successfully' })
    })
    .catch((err) => {
      return makeResponse({ res, status: 400, message: err.message })
    })
})

export const chooseTOTPMethod = asyncHandler(async (req, res) => {
  await AdminService.chooseTOTPMethod(req.params.id, req.body.method)
    .then((data) => {
      return makeResponse({ res, status: 200, data, message: 'Method chosen successfully' })
    })
    .catch((err) => {
      return makeResponse({ res, status: 400, message: err.message })
    })
})

export const verifyTOTPbyId = asyncHandler(async (req, res) => {
  await AdminService.verifyTOTPbyId(req.params.id, req.body.token)
    .then((data) => {
      return makeResponse({ res, status: 200, data, message: 'Token verified successfully' })
    })
    .catch((err) => {
      return makeResponse({ res, status: 400, message: err.message })
    })
})

const AdminController = {
  create,
  view,
  viewById,
  updateById,
  deleteById,
  login,
  refreshToken,
  getTotpStatusById,
  verifyTOTPbyId,
  chooseTOTPMethod
}

export default AdminController
