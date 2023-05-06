import asyncHandler from '../middleware/async'
import TaxAgentService from '../services/taxAgent'
import TaxAgentEmailService from '../email/taxAgent.emails'
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
    await TaxAgentService.insertTaxAgent(req.body)
        .then(async (data) => {
            await TaxAgentEmailService.sendGeneratedPassord(data, password)
            return makeResponse({ res, status: 201, data, message: 'Tax Agent added successfully' })
        })
        .catch((err) => {
            return makeResponse({ res, status: 400, message: err.message })
        })
})

export const view = asyncHandler(async (req, res) => {
    await TaxAgentService.getTaxAgents(req.query)
        .then((data) => {
            return makeResponse({ res, status: 200, data, message: 'Tax Agents retrieved successfully' })
        })
        .catch((err) => {
            return makeResponse({ res, status: 400, message: err.message })
        })
})

export const viewById = asyncHandler(async (req, res) => {
    await TaxAgentService.getTaxAgentById(req.params.id)
        .then((data) => {
            return makeResponse({ res, status: 200, data, message: 'Tax Agent retrieved successfully' })
        })
        .catch((err) => {
            return makeResponse({ res, status: 400, message: err.message })
        })
})

export const updateById = asyncHandler(async (req, res) => {
    await TaxAgentService.updateTaxAgentById(req.params.id, req.body)
        .then((data) => {
            return makeResponse({ res, status: 200, data, message: 'Tax Agent updated successfully' })
        })
        .catch((err) => {
            return makeResponse({ res, status: 400, message: err.message })
        })
})

export const deleteById = asyncHandler(async (req, res) => {
    await TaxAgentService.deleteTaxAgentById(req.params.id)
        .then((data) => {
            return makeResponse({ res, status: 200, data, message: 'Tax Agent deleted successfully' })
        })
        .catch((err) => {
            return makeResponse({ res, status: 400, message: err.message })
        })
})

export const login = asyncHandler(async (req, res) => {
    await TaxAgentService.login(req.body)
        .then((data) => {
            return makeResponse({ res, status: 200, data, message: 'Tax Agent logged in successfully' })
        })
        .catch((err) => {
            return makeResponse({ res, status: 400, message: err.message })
        })
})

export const refreshToken = asyncHandler(async (req, res) => {
    await TaxAgentService.refreshToken(req.body)
        .then((data) => {
            return makeResponse({ res, status: 200, data, message: 'Tax Agent token refreshed successfully' })
        })
        .catch((err) => {
            return makeResponse({ res, status: 400, message: err.message })
        })
})

const TaxAgentController = {
    create,
    view,
    viewById,
    updateById,
    deleteById,
    login,
    refreshToken
}

export default TaxAgentController
