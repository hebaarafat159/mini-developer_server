import 'dotenv/config'
import express from "express";
import courseController from '../controllers/courseController.js'

let userRouter = express.Router();

userRouter.get('/', async (req, res) => {
    courseController.getCourses(req, res);
})

userRouter.post('/add', async (req, res) => {
    await courseController.saveCourse(req, res);
})

export default userRouter;
