import 'dotenv/config'
import mongoose from "mongoose";
import Testimonial from '../models/testimonialModel.js';

mongoose.connect(`${process.env.DATABAE_URL}`);

export default {
    getTestimonials,
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
        console.log("get getTestimonials")
        let testimonials = await Testimonial.find({})//.populate("parent_id", "student_id");
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
    try {
        let testimonialObject = new Testimonial({
            text: req.body.text,
            date: new Date(req.body.date)
        })

        // add forign keys objects to new request object
        if (testimonialObject.parentObj !== null && testimonialObject.parentObj !== undefined) testimonialObject['parent_id'] = testimonialObject.parentObj._id
        if (testimonialObject.studentObj !== null && testimonialObject.studentObj !== undefined) testimonialObject['student_id'] = testimonialObject.studentObj._id
        if (testimonialObject.courseObj !== null && testimonialObject.courseObj !== undefined) testimonialObject['course_id'] = testimonialObject.courseObj._id

        testimonialObject = await testimonialObject.save()
        console.log(`saved testimonialObject : ${testimonialObject}`);
        res.send(retrunResponse(200, testimonialObject, ""));
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}

