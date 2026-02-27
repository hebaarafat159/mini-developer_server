import 'dotenv/config'
import mongoose from "mongoose";
import parentController from './parentController.js';
import studentController from './studentController.js';
import courseController from './courseController.js';
import mailServer from '../mailServer.js';
import Requests from '../models/requestModel.js';
import Classroom from '../models/classroomModel.js';
import locationController from './locationController.js';
import TermDates from '../models/termDatesModel.js';

mongoose.connect(`${process.env.DATABAE_URL}`);

export default {
    register,
    getCoursePlaces,
    saveClassroom,
    getTermDates
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

/**
 * Begin the process of enrolling a child in a course by saving the parent and child information if not already existing
 , then proceed to store the remaining request details.
 * @param {*} req 
 * @param {*} res 
 */
async function register(req, res) {
    try {

        // save or returun parent object
        const parent = await parentController.addParent(req.body.parentData)
        console.log(`Request Object : ${JSON.stringify(req.body)}`)

        if (parent !== null) {

            // save or return student object
            if (req.body.children && req.body.children.length > 0) {
                // add students to database
                const students = await Promise.all(req.body.children.map(async (child) => {
                    // adding parent_id,program_type and preffered_location for each student object
                    child.parent_id = parent
                    child.email = parent.email
                    child.mobile = parent.mobile
                    return await studentController.addStudent(child, parent);
                }));
                // console.log(`Students : ${students.length}`)

                // save or update requests bject
                if (students && students.length > 0) {

                    // build base request object once
                    let baseRequestObject = {
                        parentObj: parent,
                        program_type: req.body.program_type,
                        other_region: req.body.other_region
                    };

                    // region
                    if (req.body.region !== null) {
                        const regionObject = await locationController.getRegionById(req.body.region._id);
                        baseRequestObject = { ...baseRequestObject, regionObj: regionObject };
                    }

                    // course
                    if (req.body.course !== null) {
                        const courseObject = await courseController.getCourseById(req.body.course._id);
                        baseRequestObject = { ...baseRequestObject, courseObj: courseObject };
                    }

                    // classroom
                    if (req.body.classroom !== null) {
                        const classroomObject = await Classroom
                            .findById(req.body.classroom._id)
                            .populate('place_id');

                        baseRequestObject = { ...baseRequestObject, classroomObj: classroomObject };
                    }

                    // save each student registration
                    const registrations = await Promise.all(
                        students.map(async (student, index) => {

                            console.log(`Student : ${student}`);

                            // 🔹 Create a NEW request object per student
                            let requestObject = {
                                ...baseRequestObject,
                                studentObj: student
                            };

                            // add level if exists
                            if (student.course_level) {
                                const levelObject = await courseController.getCourseById(
                                    req.body.children[index].course_level._id
                                );

                                requestObject = {
                                    ...requestObject,
                                    levelObject: levelObject
                                };
                            }

                            console.log(`Registration object : ${JSON.stringify(requestObject)}`);

                            const registration = await saveRegistration(requestObject);

                            if (registration) {
                                await mailServer.sendRegistrationEmail(requestObject);
                                return registration;
                            }

                            return null;
                        })
                    );

                    const filteredRegistrations = registrations.filter(Boolean);

                    console.log(`Registrations : ${filteredRegistrations.length}`);

                    if (filteredRegistrations.length > 0)
                        res.send(retrunResponse(200, filteredRegistrations, ""));
                    else
                        res.send(retrunResponse(400, null, "We couldn't save your registration, please try again later"));
                }
            }
        }
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}

/**
 * Store the request to register a child in a course in the database.
 * @param {*} regisObj 
 * @returns 
 */
async function saveRegistration(regisObj) {
    let registrationObject = null
    console.log(`regisObj : ${JSON.stringify(regisObj)}`);
    // case of registration is exist
    registrationObject = await Requests.findOne({
        "parent_id": regisObj.parentObj._id,
        "student_id": regisObj.studentObj._id,
        "course_id": regisObj.courseObj ? regisObj.courseObj._id : undefined,
        "classroom_id": regisObj.classroomObj ? regisObj.classroomObj._id : undefined,
        "region_id": regisObj.regionObj ? regisObj.regionObj._id : undefined,
        "other_region": regisObj.other_region,
        "level_id": regisObj.leveObject ? regisObj.leveObject._id : undefined
    })
    console.log(`registrationObject : ${registrationObject}`);

    // case of new ristration
    if (registrationObject === null) {
        registrationObject = new Requests({
            "parent_id": regisObj.parentObj._id,
            "student_id": regisObj.studentObj._id,
            "program_type": regisObj.program_type,
            "other_region": regisObj.other_region,
            "lastLoginTime": new Date().getTime()
        })
        // add forign keys objects to new request object
        if (regisObj.courseObj !== null && regisObj.courseObj !== undefined) registrationObject['course_id'] = regisObj.courseObj._id
        if (regisObj.classroomObj !== null && regisObj.classroomObj !== undefined) registrationObject['classroom_id'] = regisObj.classroomObj._id
        if (regisObj.regionObj !== null && regisObj.regionObj !== undefined) registrationObject['region_id'] = regisObj.regionObj._id
        if (regisObj.leveObject !== null && regisObj.leveObject !== undefined) registrationObject['level_id'] = regisObj.leveObject._id

        registrationObject = await registrationObject.save()
        console.log(`saved registrationObject : ${registrationObject}`);
    }

    return registrationObject
}

/**
 * List all locations where a specific course is held.
 * @param {*} req 
 * @param {*} res 
 */
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

/**
 * Set up a classroom for in-person sessions if it's not exist, specifying the locations and times. 
 * @param {*} req 
 * @param {*} res 
 */
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
                days: req.body.days,
                course_id: course._id,
                region_id: place.region_id,
                place_id: place._id,

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

async function getTermDates(req, res) {
    try {
        let termDates = await TermDates.find({ 'year': req.params.year });
        res.send(retrunResponse(200, termDates, ''));
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}