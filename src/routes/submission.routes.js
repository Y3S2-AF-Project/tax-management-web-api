import express from 'express'
import { celebrate, Segments } from 'celebrate'

import { create, view, grade } from '../controllers/submission'
import { adminProtect } from '../middleware/auth'
import { submissionIdSchema, submissionViewSchema, submissionCreateSchema } from '../validations/submission'

const submissionRouter = express.Router()

submissionRouter.post('/', create)
submissionRouter.get('/', celebrate({ [Segments.QUERY]: submissionViewSchema }), view)
submissionRouter.put('/:id', celebrate({ [Segments.PARAMS]: submissionIdSchema }))

export default submissionRouter
