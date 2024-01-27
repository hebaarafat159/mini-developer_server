import 'dotenv/config'
import mongoose from "mongoose";
import Student from '../models/studentModel.js';
import parentController from './parentController.js';

mongoose.connect(`${process.env.DATABAE_URL}`);

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

async function addStudent(student, parentObject) {
    let studentObject = null
    try {
        student.parent_id = parentObject
        console.log(`Child : ${JSON.stringify(student)} \n\n`)
        studentObject = await Student.findOne({
            "parent_id": parentObject._id,
            "first_name": student.first_name,
            "last_name": student.last_name
        })

        console.log(`STudent object : ${JSON.stringify(studentObject)} \n\n`)

        if (studentObject === null) {
            const newStudent = new Student({
                first_name: student.first_name,
                last_name: student.last_name,
                age: student.age,
                hasComputer: student.hasComputer,
                email: student.email,
                mobile: student.mobile,
                hear_about_us: student.hear_about_us,
                questions: student.questions,
                parent_id: student.parent_id,
                lastLoginTime: new Date().getTime()
            })
            console.log(`Add STudent object : ${JSON.stringify(newStudent)} \n\n`)
            studentObject = await newStudent.save();
            console.log(`saved Student Object: ${studentObject}`);
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
        console.log(`Student :  ${studentObj}`);
        res.send(retrunResponse(200, studentObj, ""));
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}

async function updateStudent(req, res) {
    try {
        const studentObj = await Student.findOneAndUpdate({ "_id": req.params._id }, {
            "first_name": req.body.first_name,
            "last_name": req.body.last_name,
            "age": req.body.age,
            "hasComputer": req.body.hasComputer,
            "mobile": req.body.mobile,
            "hear_about_us": req.body.hear_about_us,
            "questions": req.body.questions,
            "lastLoginTime": new Date().getTime()
        })
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
        let studentObject = await Student.findById({ "_id": req.params._id })
        res.send(retrunResponse(200, studentObject, ""));
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}
