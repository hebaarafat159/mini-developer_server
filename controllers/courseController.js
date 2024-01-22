import 'dotenv/config'
import mongoose from "mongoose";
import Course from '../models/courseModel.js';

mongoose.connect(`${process.env.DATABAE_URL}`);

export default {
    saveCourse,
    getCourse,
    getCourses
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
        // else {
        //     const lastLoggedInTime = new Date().getTime();
        //     console.log(`Updated lastLoggedin time : ${lastLoggedInTime}`);

        //     const userObj = await User.findOneAndUpdate({ "email": userEmail }, {
        //         name: userName,
        //         lastLoginTime: lastLoggedInTime
        //     })
        //     res.send(retrunResponse(200, userObj, ""));
        // }
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}

async function getCourses(req,res){
    try{
        const filter = {};
        let courses = await Course.find(filter);//.populate("parent_cat");
        res.send(retrunResponse(200,courses,''));
    }catch(error){
        console.log("Error" + error); 
        res.send(retrunResponse(error.code, null, error.name));
    }
}

async function getCourse(req, res) {
    try {
        const userEmail = req.body.email;
        // console.log(`User email = ${userEmail}`)
        const filter = { "email": `${userEmail}` };
        let userObject = null;

        userObject = await User.findOne(filter)
        // console.log(`User Object = ${JSON.stringify(userObject)}`)
        res.send(retrunResponse(200, userObject, ""));
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}
