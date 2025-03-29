import 'dotenv/config'
import mongoose from "mongoose";
import Testimonial from '../models/testimonialModel.js';
import courseController from './courseController.js';
mongoose.connect(`${process.env.DATABAE_URL}`);

export default {
    getTestimonials,
    getLatestTestimonials,
    saveTestimonial,
    getTestimonialsByDate
}

/**
 * form the request response in each cases success and error
 * @param {*} res 
 * @param {*} status // 200 for success , any error status
 * @param {*} body // requested data in case of success and "null" if the request failed
 * @param {*} message // error message or success message
 */
function retrunResponse(status, body, message) {
    return {
        status: status,
        body: body,
        message: message
    };
}

async function getTestimonials(req, res) {
    try {
        // console.log("get getTestimonials")
        let testimonials = await Testimonial.find({}).sort(([['date', 'desc']])).populate("course_id");
        res.send(retrunResponse(200, testimonials, 'Hello there'));
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}

async function getLatestTestimonials(req, res) {
    try {
        // console.log("get getTestimonials")
        let testimonials = await Testimonial.find({}).sort(([['date', 'asc']])).limit(5)//.populate("parent_id", "student_id");
        res.send(retrunResponse(200, testimonials, 'Hello there'));
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}

async function getTestimonialsByDate(req, res) {
    try {
        let testimonials = await Testimonial.findOne({ "date": "2024-07-11T00:00:00.000+00:00" })
        console.log(JSON.stringify(testimonials))
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));

    }
}

async function saveTestimonial(req, res) {
    // console.log(`start saving `);
    try {
        let courseId = req.body.course._id;
        console.log(`course id : ${courseId}`);
        // load course object from database 
        let courseObject = await courseController.getCourseById(courseId)

        // save testimonial 
        let testimonialObject = new Testimonial({
            date: new Date(),
            text: req.body.text,
            rate: req.body.rate,
            person: req.body.person,
            course_id: courseObject ? courseObject._id : courseId,

        })

        testimonialObject = await testimonialObject.save()
        console.log(`saved testimonialObject : ${testimonialObject}`);
        res.send(retrunResponse(200, testimonialObject, ""));
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}

