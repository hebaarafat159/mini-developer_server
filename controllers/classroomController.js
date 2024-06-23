import 'dotenv/config'
import mongoose from "mongoose";
// import Classroom from '../models/classroomModel.js';
import parentController from './parentController.js';
import studentController from './studentController.js';
import courseController from './courseController.js';
import mailServer from '../mailServer.js';
import Requests from '../models/requestModel.js';
import Classroom from '../models/classroomModel.js';
import locationController from './locationController.js';

mongoose.connect(`${process.env.DATABAE_URL}`);

export default {
    register,
    getCoursePlaces,
    saveClassroom
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

async function register(req, res) {
    try {
        // save or returun parent object
        const parent = await parentController.addParent(req)
        console.log(`Parent Object : ${parent}`)

        if (parent !== null) {

            // save or return student object
            if (req.body.children && req.body.children.length > 0) {
                const students = await Promise.all(req.body.children.map(async (child) => {
                    // adding parent_id,program_type and preffered_location for each student object
                    child.parent_id = parent
                    child.program_type = req.body.program_type
                    child.preffered_location = req.body.preffered_location

                    return await studentController.addStudent(child, parent);
                }));
                console.log(`Students : ${students.length}`)

                // save or update requests bject
                if (students && students.length > 0) {

                    // get course object from database, in case of course id exists
                    let courseObject = null
                    if (req.body.course_id !== "") courseObject = await courseController.getCourseById(req.body.course_id)

                    // save each student 
                    const registerations = await Promise.all(students.map(async (student) => {
                        console.log(`Student : ${student}`)
                        const registration = await saveRegistration(courseObject, parent, student)
                        if (registration !== null) {
                            console.log(`\nSend Email course: ${JSON.stringify(courseObject)}`)
                            console.log(`\nSend Email parent: ${JSON.stringify(parent)}`)
                            console.log(`\nSend Email student: ${JSON.stringify(student)}`)
                            console.log(`\nSend Email registration: ${JSON.stringify(registration)}`)
                            mailServer.sendRegistrationEmail(courseObject, parent, student)
                            console.log(`Registeration object : ${registration}`)
                            return registration;
                        }
                    }))
                    console.log(`Registerations : ${registerations.length}`)
                    if (registerations && registerations.length > 0)
                        res.send(retrunResponse(200, registerations, ""));
                    else
                        res.send(retrunResponse(400, null, "We Couldn't save your registration, please try again later "));
                }
            }
        }
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}

async function saveRegistration(courseObject, parentObject, studentObject) {
    let registrationObject = null

    let courseId = ''
    if (courseObject !== null) courseId = courseObject._id
    console.log(`course id : ${courseId}`);

    // case of registration is exist
    registrationObject = await Requests.findOne({
        "parent_id": parentObject._id,
        "student_id": studentObject._id,
        "course_id": courseId
    })
    console.log(`registrationObject : ${registrationObject}`);

    // case of new ristration
    if (registrationObject === null) {
        const newRequest = new Requests({
            parent_id: parentObject._id,
            student_id: studentObject._id,
            course_id: courseId,
            lastLoginTime: new Date().getTime()
        })
        registrationObject = await newRequest.save();
        console.log(`saved registrationObject : ${registrationObject}`);
    }

    return registrationObject
}

async function getCoursePlaces(req, res) {
    try {
        let palces = await Classroom.find({ 'course_id': req.params.courseId, 'region_id': req.params.regionId })
            .populate(['region_id', 'course_id', 'place_id']);
        res.send(retrunResponse(200, palces, ''));
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}

async function saveClassroom(req, res) {
    try {
        let classroom = await Classroom.findOne({ '_id': req.body._id });
        console.log(`saved class Place: ${JSON.stringify(Classroom)}`);
        console.log(`Place ID: ${req.body.place_id} , course ID: ${req.body.course_id}`);
        // case of new classroom
        if (classroom === null || classroom === undefined) {
            let place = await locationController.getPlaceById(req.body.place_id);
            console.log(`place: ${JSON.stringify(place)}`);

            let course = await courseController.getCourseById(req.body.course_id);
            console.log(`course: ${JSON.stringify(course)}`);

            // save new place
            const newClassroom = new Classroom({
                title: req.body.title,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                start_time: req.body.start_time,
                end_time: req.body.end_time,
                course_id: course._id,
                region_id: place.region_id,
                place_id: place._id
            })
            const classObj = await newClassroom.save();
            res.send(retrunResponse(200, classObj, ""));
        } else {
            res.send(retrunResponse(200, classroom, ""));
        }
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}