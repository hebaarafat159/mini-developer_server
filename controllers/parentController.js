import 'dotenv/config'
import mongoose from "mongoose";
import Parent from '../models/parentModel.js';

mongoose.connect(`${process.env.DATABAE_URL}`);

export default {
    saveParent,
    getParent,
    updateParent,
    getParents,
    getParentById
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

async function saveParent(req, res) {
    const parentEmail = req.body.email;

    try {
        // case of new parent
        const parentObj = await Parent.find({ "email": parentEmail })
        if (parentObj === null || parentObj === undefined) {
            // save new parent
            const newParent = new Parent({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                mobile: req.body.mobile,
                hear_about_us: req.body.hear_about_us,
                questions: req.body.questions,
                lastLoginTime: new Date().getTime()
            })
            parentObj = await newParent.save();
            res.send(retrunResponse(200, parentObj, ""));
        } else {
            console.log(`Parent :  ${parentObj}`);
            res.send(retrunResponse(200, parentObj, ""));
        }
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}

async function updateParent(req, res) {
    try {
        const parentObj = await Parent.findOneAndUpdate({ "email": req.params.email }, {
            "first_name": req.body.first_name,
            "last_name": req.body.last_name,
            "mobile": req.body.mobile,
            "hear_about_us": req.body.hear_about_us,
            "questions": req.body.questions,
            "lastLoginTime": new Date().getTime()
        })
        await parentObj.save();
        res.send(retrunResponse(200, parentObj, ""));
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}

async function getParents(req, res) {
    try {
        const filter = {};
        let parents = await Parent.find(filter);//.populate("parent_cat");
        res.send(retrunResponse(200, parents, ''));
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}

async function getParent(req, res) {
    try {
        let parentObject = await Parent.findById({ "email": req.params.email })
        res.send(retrunResponse(200, parentObject, ""));
    } catch (error) {
        console.log("Error" + error);
        res.send(retrunResponse(error.code, null, error.name));
    }
}

async function getParentById(parentId) {
    let parentObject = null
    try {
        parentObject = await Parent.findById({ "_id": parentId })
        return parentObject;
    } catch (error) {
        console.log("Error" + error);
        parentObject = null
    }
}
