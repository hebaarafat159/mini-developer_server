import 'dotenv/config'
import mongoose from "mongoose";
import Classroom from '../models/classroomModel.js';
import parentController from './parentController.js';
import studentController from './studentController.js';
import courseController from './courseController.js';
import mailServer from '../mailServer.js';


mongoose.connect(`${process.env.DATABAE_URL}`);

export default {
    register,
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

        // save or return student object
        const students = []
        if (parent !== null) {
            if (req.body.children && req.body.children.length > 0) {
                req.body.children.map(async (child) => {

                    // adding parent_id,program_type and preffered_location for each student object
                    child.parent_id = parent
                    child.program_type = req.body.program_type
                    child.preffered_location = req.body.preffered_location

                    console.log(`Students Child : ${JSON.stringify(child)}`)
                    const studentObj = await studentController.addStudent(child, parent);
                    if (studentObj !== null) students.push(studentObj)
                })
            }
        }
        console.log(`Students : ${students.length}`)
        // TODO continue
        // save or update classroom bject
        // const registerations = []
        // if (students && students.length > 0) {
        //     // get course object from database, in case of course id exists
        //     let courseObject = null
        //     if (req.body.course_id !== "") courseObject = await courseController.getCourseById(req.body.course_id)

        //     // save each student 
        //     students.map(async (student) => {
        //         console.log(`Student : ${student}`)
        //         const registration = await saveRegistration(courseObject, parent, student)
        //         if (registration !== null) {
        //             mailServer.sendRegistrationEmail(courseObject, parent, student)
        //             registerations.push(registration)
        //         }
        //     })

        //     console.log(`Registerations : ${registerations.length}`)
        // }

        // if (registerations && registerations.length > 0)
        //     res.send(retrunResponse(200, registerations, ""));
        // else
        //     res.send(retrunResponse(400, null, "We Couldn't save your registration, please try again later "));

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
    registrationObject = await Classroom.findOne({
        "parent_id": parentObject._id,
        "student_id": studentObject._id,
        "course_id": courseId
    })
    console.log(`registrationObject : ${registrationObject}`);

    // case of new ristration
    if (registrationObject === null) {
        if (courseId === '') {
            const newClassroom = new Classroom({
                parent_id: parentObject._id,
                student_id: studentObject._id,
                lastLoginTime: new Date().getTime()
            })
            registrationObject = await newClassroom.save();
        }
        console.log(`saved registrationObject : ${registrationObject}`);
    }

    return registrationObject
}
