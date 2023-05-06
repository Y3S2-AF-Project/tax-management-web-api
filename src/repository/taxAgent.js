import logger from '../utils/logger'
import TaxAgent from '../models/taxAgent'

export const insertTaxAgent = async (taxAgent) => {
    return await TaxAgent.create(taxAgent)
        .then(async (result) => {
            await result.save()
            logger.info(`TaxAgent created successfully - id: ${result.id}`)
            delete result._doc.password
            return result
        })
        .catch((err) => {
            logger.error(`An error occurred when creating TaxAgent - err: ${err.message}`)
            throw err
        })
}

export const getTaxAgents = async () => {
    return await TaxAgent.find({}, { password: 0 })
        .lean()
        .then((result) => {
            if (result) return result
            else throw new Error('No taxAgents found')
        })
        .catch((err) => {
            logger.error(`An error occurred when retrieving taxAgents - err: ${err.message}`)
            throw err
        })
}

export const getTaxAgentById = async (id) => {
    return await TaxAgent.findById(id)
        .lean()
        .then((result) => {
            if (result) return result
            else throw new Error(`TaxAgent not found - id: ${id}`)
        })
        .catch((err) => {
            logger.error(`An error occurred when retrieving taxAgent - err: ${err.message}`)
            throw err
        })
}

export const getTaxAgentByEmail = async (email) => {
    return await TaxAgent.findOne({ email })
        .lean()
        .then((result) => result)
        .catch((err) => {
            logger.error(`An error occurred when retrieving taxAgent - err: ${err.message}`)
            throw err
        })
}

export const updateTaxAgentById = async (id, updateBody) => {
    return await TaxAgent.findByIdAndUpdate(id, updateBody, { new: true })
        .lean()
        .then((result) => {
            if (result) {
                delete result.password
                return result
            } else {
                throw new Error(`TaxAgent not found - id: ${id}`)
            }
        })
        .catch((err) => {
            logger.error(`An error occurred when updating taxAgent - err: ${err.message}`)
            throw err
        })
}

export const deleteTaxAgentById = async (id) => {
    return await TaxAgent.findByIdAndDelete(id)
        .lean()
        .then((result) => {
            if (result) {
                delete result.password
                return result
            } else throw new Error(`TaxAgent not found - id: ${id}`)
        })
        .catch((err) => {
            logger.error(`An error occurred when deleting taxAgent - err: ${err.message}`)
            throw err
        })
}

const TaxAgentRepository = {
    insertTaxAgent,
    getTaxAgents,
    getTaxAgentById,
    getTaxAgentByEmail,
    updateTaxAgentById,
    deleteTaxAgentById
}

export default TaxAgentRepository
