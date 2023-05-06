import TaxAgentRepository from '../repository/taxAgent'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const checkIfEmailExists = async (email) => {
    const taxAgent = await TaxAgentRepository.getTaxAgentByEmail(email)
    if (taxAgent) {
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

const generateToken = async (taxAgent) => {
    const payload = {
        id: taxAgent._id,
        email: taxAgent.email,
        permissions: taxAgent.permissions
    }
    return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '30m' })
}

const generateRefreshToken = async (taxAgent) => {
    const payload = {
        id: taxAgent._id,
        email: taxAgent.email,
        permissions: taxAgent.permissions
    }
    return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

export const insertTaxAgent = async (taxAgent) => {
    if (await checkIfEmailExists(taxAgent.email)) {
        throw new Error(`Email already exists - email: ${taxAgent.email}`)
    }
    const id = await generateId()
    const hashedPassword = await hashPassword(taxAgent.password)
    const newTaxAgent = {
        id,
        ...taxAgent,
        password: hashedPassword,
        lastUpdatedBy: taxAgent.addedBy
    }
    return await TaxAgentRepository.insertTaxAgent(newTaxAgent)
        .then((result) => {
            return result
        })
        .catch((err) => {
            logger.error(`An error occurred when inserting taxAgent - err: ${err.message}`)
            throw err
        })
}

export const getTaxAgents = async () => {
    return await TaxAgentRepository.getTaxAgents()
}

export const getTaxAgentById = async (id) => {
    return await TaxAgentRepository.getTaxAgentById(id)
}

export const updateTaxAgentById = async (id, taxAgent) => {
    const taxAgentToUpdate = await TaxAgentRepository.getTaxAgentById(id)
    if (!taxAgentToUpdate) {
        throw new Error(`TaxAgent not found - id: ${id}`)
    }
    if (taxAgentToUpdate.email !== taxAgent.email && (await checkIfEmailExists(taxAgent.email))) {
        throw new Error(`Email already exists - email: ${taxAgent.email}`)
    }
    const updatedTaxAgent = {
        firstName: taxAgent.firstName,
        lastName: taxAgent.lastName,
        gender: taxAgent.gender,
        email: taxAgent.email,
        phone: taxAgent.phone,
        permissions: taxAgent.permissions,
        lastUpdatedBy: taxAgent.lastUpdatedBy
    }
    return await TaxAgentRepository.updateTaxAgentById(id, updatedTaxAgent)
}

export const deleteTaxAgentById = async (id) => {
    return await TaxAgentRepository.deleteTaxAgentById(id)
}

export const login = async (email, password) => {
    const taxAgent = await TaxAgentRepository.getTaxAgentByEmail(email)
    if (!taxAgent) {
        throw new Error('Invalid email or password')
    }
    const isMatch = await comparePassword(password, taxAgent.password)
    if (!isMatch) {
        throw new Error('Invalid email or password')
    }
    const accessToken = await generateToken(taxAgent)
    const refreshToken = await generateRefreshToken(taxAgent)
    const response = {
        _id: taxAgent._id,
        id: taxAgent.id,
        firstName: taxAgent.firstName,
        lastName: taxAgent.lastName,
        gender: taxAgent.gender,
        email: taxAgent.email,
        phone: taxAgent.phone,
        permissions: taxAgent.permissions,
        avatar: taxAgent.avatar,
        isFirstLogin: taxAgent.isFirstLogin,
        accessToken,
        refreshToken
    }
    return response
}

export const refreshToken = async (refreshToken) => {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET)
    const taxAgent = await TaxAgentRepository.getTaxAgentById(decoded.id)
    if (!taxAgent) {
        throw new Error('Invalid refresh token')
    }
    const accessToken = await generateToken(taxAgent)
    const newRefreshToken = await generateRefreshToken(taxAgent)
    const response = {
        accessToken,
        refreshToken: newRefreshToken
    }
    return response
}

const TaxAgentService = {
    insertTaxAgent,
    getTaxAgents,
    getTaxAgentById,
    updateTaxAgentById,
    deleteTaxAgentById,
    login,
    refreshToken
}

export default TaxAgentService
