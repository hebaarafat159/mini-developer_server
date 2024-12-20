import 'dotenv/config'
import mongoose from "mongoose";
import Course from '../models/courseModel.js';

mongoose.connect(`${process.env.DATABAE_URL}`);
const ObjectId = mongoose.Types.ObjectId;
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
    try {
        const courseTitle = req.body.title;
        let pre_courses = req.body.prerequisite_courses
        // get all prerequisite courses
        if (pre_courses !== null && pre_courses !== undefined && pre_courses.length > 0) {
            const students = await Promise.all(pre_courses.map(async (pre_course) => {
                return await Course.findOne({ '_id': pre_course._id });
            }));
        }

        // get all courses level
        let levels_courses = req.body.levels
        if (levels_courses !== null && levels_courses !== undefined && levels_courses.length > 0) {
            const students = await Promise.all(levels_courses.map(async (levels_course) => {
                return await Course.findOne({ '_id': levels_course._id });
            }));
        }

        // case of new course
        if (await Course.count({ "title": courseTitle }) === 0) {
            // save new course
            const newCourse = new Course({
                title: req.body.title,
                slogan: req.body.slogan,
                age: req.body.age,
                language: req.body.language,
                cover_image: req.body.cover_image,
                course_duration: req.body.course_duration,
                total_session_duration: req.body.total_session_duration,
                total_price: req.body.total_price,
                type: req.body.type,// In-person or online
                prerequisite_courses: pre_courses, // saved courses objectIds
                description: req.body.description,
                course_subjects: req.body.course_subjects,
                course_skills: req.body.course_skills,
                levels: levels_courses, // save levels objectsIds
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
            "slogan": req.body.slogan,
            "age": req.body.age,
            "language": req.body.language,
            "cover_image": req.body.cover_image,
            "course_duration": req.body.course_duration,
            "total_session_duration": req.body.total_session_duration,
            "total_price": req.body.total_price,
            "type": req.body.type,// In-person or online
            "prerequisite_courses": pre_courses, // saved courses objectIds
            "description": req.body.description,
            "course_subjects": req.body.course_subjects,
            "course_skills": req.body.course_skills,
            "levels": req.body.levels,
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
        let courses = await Course.find(filter).where({ "periority": 0 }).populate(["prerequisite_courses", "levels"]);
        res.send(retrunResponse(200, courses, ''));
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}

async function getCourse(req, res) {
    try {
        console.log(`Course Object : ${req.params.id}`);
        let courseObject;
        if (ObjectId.isValid(req.params.id)) {
            // If valid ObjectId, search by _id or seo_slug
            courseObject = await Course.findOne({
                $or: [
                    { _id: req.params.id },
                    { seo_slug: req.params.id },
                ]
            }).populate(["prerequisite_courses", "levels"]);
        } else {
            // If not a valid ObjectId, only search by seo_slug
            courseObject = await Course.findOne({
                seo_slug: req.params.id
            }).populate(["prerequisite_courses", "levels"]);
        }
        // console.log(`Course Object : ${JSON.stringify(courseObject)}`);
        res.send(retrunResponse(200, courseObject, ""));
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}

async function getCourseById(courseId) {
    try {
        let courseObject = await Course.findOne({ "_id": courseId })
        return courseObject
    } catch (error) {
        console.log("Error" + error);
        return null
    }
}

