import { getOneUser } from '../repository/user'
import { verifyAccessToken } from '../utils/jwt'
import { makeResponse } from '../utils/response'
import asyncHandler from './async'

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization ? (req.headers.authorization.startsWith('Bearer') ? req.headers.authorization.split(' ')[1]?.replace('null', '')?.replace('undefined', '') : null) : null
  if (!token) return makeResponse({ res, status: 403, message: 'Unauthorized' })
  const decodedUser = verifyAccessToken(token).data
  const user = decodedUser ? await getOneUser({ _id: decodedUser._id }, false) : null
  if (!user) return makeResponse({ res, status: 403, message: 'Unauthorized' })
  req.user = user
  next()
})

export const adminProtect = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'ADMIN') return makeResponse({ res, status: 403, message: 'Unauthorized' })
  next()
})

export const individualProtect = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'INDIVIDUAL') return makeResponse({ res, status: 403, message: 'Unauthorized' })
  next()
})

export const cooperateProtect = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'COOPERATE') return makeResponse({ res, status: 403, message: 'Unauthorized' })
  next()
})