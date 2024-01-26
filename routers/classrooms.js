import 'dotenv/config'
import express from "express";
import classroomController from '../controllers/classroomController.js'

let classroomRouter = express.Router();

classroomRouter.post('/register', async (req, res) => {
    await classroomController.register(req, res);
})

export default classroomRouter;