import 'dotenv/config'
import mongoose from "mongoose";
import Student from '../models/studentModel.js';
import parentController from './parentController.js';

mongoose.connect(`${process.env.DATABAE_URL}`);
const ObjectId = mongoose.Types.ObjectId;

export default {
    saveStudent,
    addStudent,
    getStudent,
    updateStudent,
    getStudents
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

async function generateStudentSlug(studentObject) {
    console.log(`saved Student Slug ID: ${studentObject._id.toString()}`);
    const max = studentObject._id.toString().length
    console.log(`saved Student Slug ID: ${max}`);
    var startIndex = Math.floor(Math.random() * max)
    var endIndex = Math.floor(Math.random() * max)
    while (startIndex >= endIndex) {
        var startIndex = Math.floor(Math.random() * max)
        var endIndex = Math.floor(Math.random() * max)
    }
    var subIndex = studentObject._id.toString().substring(startIndex, endIndex)
    var slug = `${studentObject.first_name}-${studentObject.last_name}-${subIndex}`
    console.log(`saved Student Slug: ${slug}`);
    return slug.toString()
}

async function addStudent(student, parentObject) {
    let studentObject = null
    try {
        studentObject = await Student.findOne({
            "parent_id": parentObject._id,
            "first_name": student.first_name,
            "last_name": student.last_name,
        })

        if (studentObject === null) {
            const newStudent = new Student(student)
            // console.log(`Add STudent object : ${JSON.stringify(newStudent)} \n\n`)
            studentObject = await newStudent.save();
            // create student slug and update student object with it
            if (studentObject !== null) {
                var slug = await generateStudentSlug(studentObject)

                // update saved student object with student slug
                var updatedObject = await Student.findOneAndUpdate({ '_id': studentObject._id }, { 'slug': slug })
                if (updatedObject !== null) studentObject['slug'] = slug
            }
            // console.log(`Add STudent Object: ${studentObject}`);
        }

    } catch (error) {
        console.log("Error" + error);
        studentObject = null
    }

    return studentObject
}

async function saveStudent(req, res) {
    try {
        // case of new parent
        const studentObj = await addStudent(req.body.child, req.body.parent_id);
        // console.log(`Student :  ${studentObj}`);
        res.send(retrunResponse(200, studentObj, ""));
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}

async function updateStudent(req, res) {
    try {
        const studentObj = await Student.findOneAndUpdate({ "_id": req.params.id }, {
            'first_name': req.body.first_name,
            'last_name': req.body.last_name,
            'age': req.body.age,
            'has_computer': req.body.hasComputer,
            'mobile': req.body.mobile,
            'is_social_allowed': req.body.is_social_allowed,
            'is_local_allowed': req.body.is_local_allowed,
            'medical_condition': req.body.medical_condition,
            'emergency_contact_name': req.body.emergency_contact_name,
            'emergency_contact_phone_number': req.body.emergency_contact_phone_number,
            'comment': req.body.comment,
            'lastLoginTime': new Date().getTime()
        })
        // console.log(`Update STudent: ${JSON.stringify(studentObj)}`);
        await studentObj.save();
        res.send(retrunResponse(200, studentObj, ""));
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}

async function getStudents(req, res) {
    try {
        const filter = {};
        let students = await Student.find(filter);//.populate("parent_cat");
        res.send(retrunResponse(200, students, ''));
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}

async function getStudent(req, res) {
    try {
        // console.log(`student conset form id: ${req.params.id}`)
        let studentObject;
        if (ObjectId.isValid(req.params.id)) {
            // If valid ObjectId, search by _id or seo_slug
            studentObject = await Student.findOne({
                $or: [
                    { _id: req.params.id },
                    { slug: req.params.id },
                ]
            }).populate(['parent_id'])
        } else {
            // If not a valid ObjectId, only search by seo_slug
            studentObject = await Student.findOne({
                slug: req.params.id
            }).populate(['parent_id'])
        }
        // console.log(`Student Object : ${JSON.stringify(courseObject)}`);
        res.send(retrunResponse(200, studentObject, ""));
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}
