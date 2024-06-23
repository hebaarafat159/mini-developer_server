import 'dotenv/config'
import express from "express";
import locationController from '../controllers/locationController.js'
import classroomController from '../controllers/classroomController.js';


let locationRouter = express.Router();

locationRouter.post('/regions/add', async (req, res) => {
    await locationController.saveRegion(req, res);
})

locationRouter.get('/regions', async (req, res) => {
    await locationController.getRegions(req, res);
})

locationRouter.get('/regions/active', async (req, res) => {
    await locationController.getActiveRegions(req, res);
})

locationRouter.get('/regions/places', async (req, res) => {
    await locationController.getRegions(req, res);
})

locationRouter.get('/places', async (req, res) => {
    await locationController.getAllPlaces(req, res);
})

locationRouter.post('/regions/places/add', async (req, res) => {
    await locationController.savePalce(req, res);
})

export default locationRouter;