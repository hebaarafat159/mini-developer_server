import 'dotenv/config'
import mongoose from "mongoose";
import Student from '../models/studentModel.js';
import parentController from '../controllers/parentController.js'

mongoose.connect(`${process.env.DATABAE_URL}`);

export default {
    saveStudent,
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

async function saveStudent(req, res) {
    try {
        // case of new parent
        if (await Student.count({ "_id": req.body._id }) === 0) { 
            // const parentObject = parentController.getParentById(req.body.parent_id)
            // console.log(`Parent Object : ${JSON.stringify(parentObject)}`)
            // save new parent
            const newStudent = new Student({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                age: req.body.age,
                hasComputer: req.body.hasComputer,
                email: req.body.email,
                mobile: req.body.mobile,
                hear_about_us: req.body.hear_about_us,
                questions: req.body.questions,
                parent_id: req.body.parent_id,
                lastLoginTime: new Date().getTime()
            })
            const studentObj = await newStudent.save();
            res.send(retrunResponse(200, studentObj, ""));
        }
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
