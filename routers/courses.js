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

// get all users testimonials on courses
courseRouter.get('/testimonials', async (req, res) => {
    testimonialController.getTestimonials(req, res);
})

// save new testimonials to database 
courseRouter.post('/testimonials/add', async (req, res) => {
    await testimonialController.saveTestimonial(req, res);
})

export default courseRouter;
