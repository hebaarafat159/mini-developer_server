import 'dotenv/config'
import express from "express";
import classroomController from '../controllers/classroomController.js'

let classroomRouter = express.Router();

classroomRouter.post('/register', async (req, res) => {
    await classroomController.register(req, res);
})

classroomRouter.post('/add', async (req, res) => {
    await classroomController.saveClassroom(req, res);
})

classroomRouter.get('/places/:regionId/:courseId', async (req, res) => {
    await classroomController.getCoursePlaces(req, res);
})

classroomRouter.get('/termdates/:year', async (req, res) => {
    await classroomController.getTermDates(req, res);
})
export default classroomRouter;