import 'dotenv/config'
import express from "express";
import parentController from '../controllers/parentController.js'

let parentRouter = express.Router();

parentRouter.post('/add', async (req, res) => {
    await parentController.saveParent(req, res);
})

parentRouter.put('/:email', async (req, res) => {
    await parentController.updateParent(req, res);
})

parentRouter.delete('/:id', async (req, res) => {
    await parentController.delete(req, res);
})

parentRouter.get('/', async (req, res) => {
    parentController.getParents(req, res);
})

parentRouter.get('/:email', async (req, res) => {
    parentController.getParent(req, res);
})

export default parentRouter;
