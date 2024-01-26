import 'dotenv/config'
import mongoose from "mongoose";
import Classroom from '../models/classroomModel.js';
import parentController from './parentController.js';
import studentController from './studentController.js';

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

        // save or update classroom bject


        // case of new parent
        // if (await Classroom.count({ "_id": req.body.id }) === 0) {
        // save new parent
        // const newClassroom = new Classroom({
        //     parent_id: req.body.parent_id,
        //     student_id: req.body.student_id,
        //     course_id: req.body.course_id,
        //     lastLoginTime: new Date().getTime()
        // })
        // const classroomObj = await newClassroom.save();
        // res.send(retrunResponse(200, classroomObj, ""));
        // }
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}
