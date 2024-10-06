import 'dotenv/config'
import express from "express";
import testmonialController from '../controllers/testimonialController.js'

let testmonialRouter = express.Router();

testmonialRouter.get('/', async (req, res) => {
    // console.log("Start saving user data");
    await testmonialController.getTestimonials(req, res);
})

testmonialRouter.get('/latesttestimonials', async (req, res) => {
    await testmonialController.getLatestTestimonials(req, res);
})

testmonialRouter.post('/testimonials/add', async (req, res) => {
    await testmonialController.saveTestimonial(req, res);
})

export default testmonialRouter;
