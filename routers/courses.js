import 'dotenv/config'
import express from "express";
import courseController from '../controllers/courseController.js'
import testimonialController from '../controllers/testimonialController.js';

let courseRouter = express.Router();

courseRouter.post('/add', async (req, res) => {
    await courseController.saveCourse(req, res);
})

courseRouter.put('/:id', async (req, res) => {
    await courseController.updateCourse(req, res);
})

courseRouter.delete('/:id', async (req, res) => {
    // await courseController.(req, res);
})

courseRouter.get('/', async (req, res) => {
    courseController.getCourses(req, res);
})

courseRouter.get('/:id', async (req, res) => {
    courseController.getCourse(req, res);
})

export default courseRouter;
