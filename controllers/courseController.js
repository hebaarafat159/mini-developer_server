import 'dotenv/config'
import mongoose from "mongoose";
import Course from '../models/courseModel.js';

mongoose.connect(`${process.env.DATABAE_URL}`);

export default {
    saveCourse,
    getCourse,
    getCourses,
    updateCourse,
    getCourseById
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

async function saveCourse(req, res) {
    const courseTitle = req.body.title;

    try {
        // case of new course
        if (await Course.count({ "title": courseTitle }) === 0) {
            // save new course
            const newCourse = new Course({
                title: req.body.title,
                age: req.body.age,
                language: req.body.language,
                cover: req.body.image,
                lastLoginTime: new Date().getTime()
            })
            const courseObj = await newCourse.save();
            res.send(retrunResponse(200, courseObj, ""));
        }
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}

async function updateCourse(req, res) {
    try {
        const courseObj = await Course.findOneAndUpdate({ "_id": req.params.id }, {
            "title": req.body.title,
            "age": req.body.age,
            "language": req.body.language,
            "cover_image": req.body.cover_image,
            "course_duration": req.body.duration, // How long the course will be running.
            "session_duration": req.body.session_duration, // How long each session is.
            "price": req.body.price,
            "type": req.body.type,// In-person or online
            "prerequisite_courses": req.body.prerequisite_courses,
            "description": req.body.description,
            "course_subjects": req.body.course_subjects,
            "course_skills": req.body.course_skills,
            "lastLoginTime": new Date().getTime(),
        })
        await courseObj.save();
        res.send(retrunResponse(200, courseObj, ""));
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}

async function getCourses(req, res) {
    try {
        const filter = {};
        let courses = await Course.find(filter);//.populate("parent_cat");
        res.send(retrunResponse(200, courses, ''));
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}

async function getCourse(req, res) {
    try {
        let courseObject = await Course.findById({ "_id": req.params.id })
        res.send(retrunResponse(200, courseObject, ""));
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}

async function getCourseById(courseId) {
    try {
        let courseObject = await Course.findById({ "_id": courseId })
        return courseObject
    } catch (error) {
        console.log("Error" + error);
        return null
    }
}

