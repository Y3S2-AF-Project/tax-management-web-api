import express from "express";
import TaxAgentController from "../controllers/taxAgent";

const taxAgentRouter = express.Router()

taxAgentRouter.post('/', TaxAgentController.create)
taxAgentRouter.get('/', TaxAgentController.view)
taxAgentRouter.get('/:id', TaxAgentController.viewById)
taxAgentRouter.put('/:id', TaxAgentController.updateById)
taxAgentRouter.delete('/:id', TaxAgentController.deleteById)
taxAgentRouter.post('/login', TaxAgentController.login)
taxAgentRouter.post('/refresh', TaxAgentController.refreshToken)

export default taxAgentRouter
