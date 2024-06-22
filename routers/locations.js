import 'dotenv/config'
import express from "express";
import locationController from '../controllers/locationController.js'

let locationRouter = express.Router();

locationRouter.post('/regions/add', async (req, res) => {
    await locationController.saveRegion(req, res);
})

locationRouter.get('/regions', async (req, res) => {
    await locationController.getRegions(req, res);
})
export default locationRouter;